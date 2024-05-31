/**
 * @module 数据模型
 */
import Cache from "./cache";

import ModelInitScript from "../conf/modelInitScript"; // 加载字段
ModelInitScript;

import {
  LAZYLOAD_PLACEHOLDER as lazy_placeholder,
  INVALID_DATA as invalid_data,
} from "./cache";
import apiAdapter from "../conf/apiAdapter";

export const LAZYLOAD_PLACEHOLDER = lazy_placeholder;
export const INVALID_DATA = invalid_data;

/**
 * @class 数据模型
 */
class Model {
  public year: Array<number> = [];

  /**
   * 初始化
   */
  public init(): Promise<void> {
    return Cache.init().then((year) => {
      this.year = year;
    });
  }

  /**
   * 拉取数据
   * @param year
   * @param type
   * @returns Promise
   * @usage 传入需要加载的数据，然后在这个方法返回的Promise里获取数据然后dom操作
   * @warring 注意不要访问没有加载的数据
   */
  public fetch({
    year,
    type,
  }: {
    year: Array<number> | number;
    type: Array<string> | string;
  }): Promise<(year: number) => (type: string) => any> {
    return Cache.load({
      line: year,
      field: type,
    })
      .then(() => {
        return function (year: number): (type: string) => any {
          return function (type: string): any {
            return Cache.get(year, type);
          };
        };
      })
      .catch(() => {
        throw function (year: number): (type: string) => any {
          return function (type: string): any {
            return Cache.get(year, type);
          };
        };
      });
  }

  /**
   * 获取缓存数据
   * @param year
   * @param type
   * @returns
   */
  public getCache(year: number, type: string): any {
    return Cache.get(year, type);
  }

  /**
   * 刷新缓存
   * @param year
   * @param type
   * @returns
   */
  public clearCache(
    year: Array<number> | number,
    type: Array<string> | string
  ) {
    Cache.clear({
      line: year,
      field: type,
    });
  }

  /**
   * 提交数据
   * @param type 数据名
   * @param year 年
   * @param month 月
   * @param data 数据
   * @returns Promise，响应数据
   * @warring 只能用于Cxx基础值
   */
  public async put(
    type: string,
    year: number,
    month: number,
    data: number
  ): Promise<any> {
    this.clearCache(year, type);

    const response = await apiAdapter.putData(type, year, month, data);
    // 更新缓存
    //let cache = [...this.getCache(year, type)];
    //cache[month - 1] = response.data.data;
    //Cache.set(year, type, cache);

    return response.data;
  }

  public async del(id: number): Promise<any> {
    const response = await apiAdapter.delData(id);
    return response.data;
  }

  public async query(query_pattern: any): Promise<any> {
    const response = await apiAdapter.queryData(query_pattern);
    return response.data;
  }
}

// 保持单例
export const model = new Model();

export default model;
