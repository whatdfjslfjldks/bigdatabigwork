import createReport from "docx-templates";

import * as Conf from "../conf/config";

export default class CreateDocx {
  private static base_url: string = Conf.docxtpl_prefix;

  private static tpl: Map<string, ArrayBuffer | null> = new Map();

  private static get tpllist(): string[] {
    let iter = Self.tpl.keys();
    let res: string[] = [];
    for (;;) {
      let next = iter.next();
      if (next.done) break;
      res.push(next.value);
    }
    return res;
  }

  /**
   * 注册模板
   * @param tpl 模板文件名
   */
  public static registTpl(tpl: string) {
    Self.tpl.set(tpl, null);
  }

  /**
   * 加载模板
   * @param tpl 模板文件名
   * @returns 模板文件的ArrayBuffer
   */
  public static loadTpl(tpl: string): Promise<ArrayBuffer> {
    const tpl_cache = Self.tpl.get(tpl);
    if (tpl_cache === undefined) throw new Error("未定义的模板" + tpl);
    if (tpl_cache !== null) {
      return new Promise((resolve, reject) => {
        resolve(tpl_cache);
      });
    }
    return fetch(Self.base_url + tpl).then((res) => res.arrayBuffer());
  }

  /**
   * 使用模板
   * @param tpl 模板文件名
   * @returns 本类实例
   */
  public static use(tpl: string) {
    return new Self(tpl);
  }

  private cur_tpl: string;

  constructor(tpl: string) {
    if (!Self.tpl.has(tpl)) throw new Error("未定义的模板" + tpl);
    this.cur_tpl = tpl;
  }

  /**
   * 渲染docx
   * @param data 数据
   * @param jsctx js环境
   * @returns Promise<输出docx的Uint8Array>
   */
  public async rend(
    data: {
      [keys: string]: any;
    },
    jsctx: {
      [keys: string]: any;
    }
  ) {
    const template = await Self.loadTpl(this.cur_tpl);
    const report = await createReport({
      template: new Uint8Array(template),
      data,
      additionalJsContext: jsctx,
      cmdDelimiter: ["{{", "}}"],
    });
    return report;
  }

  /**
   * 生成docx
   * @param filename 文件名
   * @param data 数据
   * @param jsctx js环境
   */
  public async make(
    filename: string,
    data: { [keys: string]: any } = {},
    jsctx: { [keys: string]: any } = {}
  ) {
    const report = this.rend(data, jsctx);
    const url = URL.createObjectURL(new Blob([await report]));
    const e = document.createElement("a");
    e.href = url;
    e.download = filename;
    e.click();
  }
}

var Self = CreateDocx;
