/**
 * @module 缓存引擎
 */
import Table from "./table";
import Data from "./dataWrap";
import apiAdapter from "../conf/apiAdapter";

// 懒加载占位符
export const LAZYLOAD_PLACEHOLDER: symbol = Symbol("LAZYLOAD_PLACEHOLDER");
// 非法数据
export const INVALID_DATA: symbol = Symbol("INVALID_DATA");

type Field = {
  name: string; // 字段的名称
  origin: "primitive" | "reference"; // 字段的来源，从后端获取的原始数据或前端计算的引用数据
  cache: boolean; // 是否缓存，原始数据统一缓存
  deps: Set<string>; // 依赖哪些数据
  deplines: Set<number>; // 依赖的行，相对于当年的偏差值，如同比增长率依赖[-1,0]
  deped: Set<string>; // 被哪些数据依赖
  map?: (
    line: number,
    getter: (line: number) => (field: string) => any,
    SIG?: {
      LAZYLOAD_PLACEHOLDER: symbol;
      INVALID_DATA: symbol;
    }
  ) => any; // 映射关系，引用字段必需
};

/**
 * @class 数据缓存
 */
class CacheEngine {
  private line: Array<number> = []; // 缓存的行
  private field: Map<string, Field> = new Map(); // 缓存的字段

  private cache = new Table(); // 缓存
  private cache_delay = new Table(); // 二级缓存，处理并发情况

  /**
   * 缓存初始化
   * @returns 返回Promise
   */
  public init(): Promise<Array<number>> {
    return apiAdapter.getYear().then((line) => {
      // 记录
      this.line = [...line];
      this.line.forEach((value) => {
        this.cache.addData(parseInt(value as unknown as string));
      });
      return line;
    });
  }

  /**
   * 获取数据（同步非阻塞）
   * @param line 行
   * @param field 字段
   * @returns 数据
   */
  public get(line: number, field: string): any {
    const field_type = this.field.get(field);
    // 字段未知的情况
    if (typeof field_type === "undefined") return INVALID_DATA;
    // 数据范围外的情况
    if (this.line.indexOf(line) === -1) return INVALID_DATA;
    // 原始数据
    if (field_type.origin === "primitive") {
      let res = this.cache.get(line, field);
      if (res === Table.EMPTY) {
        res = this.cache_delay.get(line, field);
      }
      if (res === Table.EMPTY) {
        return LAZYLOAD_PLACEHOLDER;
      } else {
        return res;
      }
    }
    // 引用数据
    if (field_type.origin === "reference") {
      // 缓存的引用数据，先查缓存
      if (field_type.cache) {
        let res = this.cache.get(line, field);
        if (res !== Table.EMPTY) {
          return res;
        }
      }
      // 不缓存的和缓存失效的重新计算
      let that = this;
      let res = (field_type.map as Function)(
        line,
        function (line: number) {
          return function (field: string) {
            // 递归查找
            return that.get(line, field);
          };
        },
        {
          LAZYLOAD_PLACEHOLDER,
          INVALID_DATA,
        }
      );
      // 记录缓存
      if (field_type.cache) this.cache.set(line, field, res);
      return res;
    }
  }

  /**
   * 加载数据到缓存
   * @param {line} 行
   * @param {field} 字段
   * @returns
   */
  public async load({
    line,
    field,
  }: {
    line: Array<number> | number;
    field: Array<string> | string;
  }): Promise<boolean> {
    if (typeof line === "number") line = [line];
    if (typeof field === "string") field = [field];

    let field_need_fetch: Set<string> = new Set(); // 需要拉取的字段
    let line_need_fetch: Set<number> = new Set(line); // 需要拉取的行
    let line_reqed: Set<number> = new Set(); // 引用字段需要的行的偏移量
    let preload_ref_field: Set<string> = new Set(); // 预加载的引用字段
    let field_need_update: Set<string> = new Set(); // 需要更新的字段

    // 字段遍历，分流
    let field_que = [...field];
    while (field_que.length > 0) {
      const field_type = this.field.get(field_que.shift() as string);
      if (typeof field_type === "undefined") continue;
      if (field_type.origin === "reference") {
        field_que.push(...Array.from(field_type.deps));
        field_type.deplines.forEach((value) => {
          line_reqed.add(value);
        });
        if (field_type.cache) {
          preload_ref_field.add(field_type.name);
        }
        continue;
      } else {
        field_need_fetch.add(field_type.name);
        if (!field_type.cache) {
          field_need_update.add(field_type.name);
        }
      }
    }

    // 统计行
    line.forEach((line) => {
      line_reqed.forEach((offset) => {
        line_need_fetch.add(line + offset);
      });
    });

    // 移除已经缓存的
    let final_need_fetch = this.cache.test(
      Array.from(line_need_fetch),
      Array.from(field_need_fetch)
    );

    // 开始请求
    const data = await apiAdapter.getData(final_need_fetch);
    // 进行包装
    let wrapped_data: {
      [key: string]: {
        [field: string]: any;
      };
    } = {};
    Object.entries(data).forEach(([key, row]) => {
      Object.entries(row).forEach(([field, dt]) => {
        wrapped_data[key] = wrapped_data[key] ?? {};
        wrapped_data[key][field] = new Data(dt);
      });
    });
    // 更新数据
    this.cache.del(Array.from(line_need_fetch), Array.from(field_need_update));
    this.cache.import(wrapped_data);
    return true;
  }

  /**
   * 清理缓存
   * @param {line, field} 行 字段
   */
  public clear({
    line,
    field,
  }: {
    line?: Array<number> | number;
    field?: Array<string> | string;
  }) {
    let linel =
      typeof line === "number"
        ? [line]
        : typeof line === "undefined"
        ? [...this.line]
        : line;
    let fieldl: Array<string> =
      typeof field === "string"
        ? [field]
        : typeof field === "undefined"
        ? []
        : field;
    if (typeof field === "undefined") {
      fieldl = [];
      this.field.forEach((value, key) => {
        (fieldl as Array<string>).push(key);
      });
    }

    const line_offset_need_clear: Set<number> = new Set([0]);
    const field_need_clear: Set<string> = new Set();
    // 字段遍历
    let field_que = [...fieldl];
    while (field_que.length > 0) {
      const field_type = this.field.get(field_que.shift() as string);
      if (typeof field_type === "undefined") continue;
      if (field_type.origin === "reference") {
        field_que.push(...Array.from(field_type.deped));
        field_type.deplines.forEach((value) => {
          line_offset_need_clear.add(value);
        });
        if (field_type.cache) {
          field_need_clear.add(field_type.name);
        }
        continue;
      } else {
        field_need_clear.add(field_type.name);
      }
    }

    const line_need_clear: Set<number> = new Set();
    // 统计行
    linel.forEach((line) => {
      line_offset_need_clear.forEach((offset) => {
        line_need_clear.add(line + offset);
      });
    });

    const lines = Array.from(line_need_clear);
    const fields = Array.from(field_need_clear);
    // 转移到二级缓存
    this.cache_delay.import(this.cache.export(lines, fields));
    // 释放缓存
    this.cache.del(lines, fields);
  }

  /**
   * 注册字段
   * @param field_config Field
   * @returns
   */
  public registField(field_config: {
    name: string;
    origin?: "primitive" | "reference";
    deps?: Array<string>;
    deplines?: Array<number>;
    cache?: "cache" | "no-cache";
    map?: (
      line: number,
      getter: (line: number) => (field: string) => any,
      SIG?: {
        LAZYLOAD_PLACEHOLDER: symbol;
        INVALID_DATA: symbol;
      }
    ) => any;
  }): boolean {
    let brk = false;

    // 检查依赖的数据（避免循环依赖）
    field_config.deps &&
      (() => {
        for (const element of field_config.deps) {
          if (!this.field.has(element)) brk = true;
          return;
        }
      })();
    if (brk) return false;

    const field: Field = {
      name: field_config.name,
      origin: field_config.origin ?? "primitive",
      deps: new Set(field_config.deps ?? []),
      deplines: new Set(field_config.deplines ?? [0]),
      deped: new Set(),
      cache: (field_config.cache ?? "cache") === "cache",
      map: field_config.map,
    };

    // 引用数据必须有映射关系
    if (field.origin === "reference" && field.map === undefined) return false;

    // 建立记录
    this.field.set(field.name, field);
    field.deps.forEach((value) => {
      (this.field.get(value) as Field).deped.add(field.name);
    });

    // 在表格中加一列
    if (field.cache || field.origin !== "reference")
      this.cache.addField(field.name);

    return true;
  }
}

export const cache = new CacheEngine();

export default cache;
