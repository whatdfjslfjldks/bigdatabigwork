/**
 * @module 表引擎
 * @class 表格
 */
export default class Table {
  private line: Set<number> = new Set();

  private header: Set<string> = new Set();

  private body: Map<number, Map<string, any>> = new Map();

  public static EMPTY: symbol = Symbol("TABLE_EMPTY");

  public addField(field: string) {
    this.header.add(field);
    return this;
  }

  public addData(id: number) {
    this.line.add(id);
    return this;
  }

  public set(id: number, field: string, data: any): boolean {
    if (!this.line.has(id)) return false;
    if (!this.header.has(field)) return false;
    if (data === Table.EMPTY) return false;
    let row = this.body.get(id);
    if (typeof row === "undefined") {
      row = new Map();
      this.body.set(id, row);
    }
    row.set(field, data);
    return true;
  }

  public import(data: {
    [id: string]: {
      [field: string]: any;
    };
  }) {
    Object.entries(data).forEach(([key, row]) => {
      const id = parseInt(key);
      Object.entries(row).forEach(([field, data]) => {
        this.set(id, field, data);
      });
    });
    return this;
  }

  public get(id: number, field: string): any {
    if (!this.line.has(id)) return Table.EMPTY;
    if (!this.header.has(field)) return Table.EMPTY;
    let row = this.body.get(id);
    if (typeof row === "undefined") return Table.EMPTY;
    let col = row.get(field);
    if (typeof col === "undefined") return Table.EMPTY;
    else return col;
  }

  public export(
    id: number[],
    field: string[]
  ): {
    [id: string]: {
      [field: string]: any;
    };
  } {
    let res: {
      [id: string]: {
        [field: string]: any;
      };
    } = {};
    id.forEach((id) => {
      field.forEach((field) => {
        res[id.toString()] = res[id.toString()] ?? {};
        res[id.toString()][field] = this.get(id, field);
      });
    });
    return res;
  }

  // 查找缓存失效的字段和行
  public test(id: number[], field: string[]): [number[], string[]] {
    let result_id: Set<number> = new Set();
    let result_field: Set<string> = new Set();
    let rest_id: Set<number> = new Set(id);
    let rest_field: Set<string> = new Set(field);

    // 删去范围外的字段
    rest_id.forEach((id) => {
      if (!this.line.has(id)) rest_id.delete(id);
    });
    rest_field.forEach((field) => {
      if (!this.header.has(field)) rest_field.delete(field);
    });

    // 开始检查
    rest_id.forEach((id) => {
      const row = this.body.get(id);
      if (typeof row === "undefined") {
        result_id.add(id);
        result_field = rest_field;
      } else {
        rest_field.forEach((field) => {
          if (!row.has(field)) {
            result_id.add(id);
            result_field.add(field);
            rest_field.delete(field);
          }
        });
      }
    });

    return [Array.from(result_id), Array.from(result_field)];
  }

  public del(id: number[], field: string[]) {
    id.forEach((id) => {
      let row = this.body.get(id);
      if (typeof row === "undefined") return;
      field.forEach((field) => {
        row?.delete(field);
      });
      if (row.size === 0) this.body.delete(id);
    });
    return this;
  }
}
