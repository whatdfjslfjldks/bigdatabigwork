import axios, { AxiosResponse } from "axios";

import * as Conf from "./config";

import * as TestData from "../test/test";

/**
 * 接口适配器
 * 调试时可以在这里造响应数据
 */
export default class apiAdapter {
  public static async getYear(): Promise<any> {
    // return new Promise((resolve, reject) => {
    //   resolve(TestData.test_year);
    // });

    const response = await axios({
      method: "post",
      url: Conf.api_prifix + "/GetYearsOfOriginal?indexNum=C11",
      responseType: "json",
      data: {
        indexNum: "C11",
      },
    });

    if (response.data.code !== 0) {
      console.error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`,
        {},
        response.data
      );
      throw Error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`
      );
    }

    const data = Array.from(response.data.data.years);

    if (typeof data !== "object") throw new Error("getYear响应格式不正确");
    data.forEach((value: any) => {
      if (typeof value !== "number") {
        throw new Error("getYear响应格式不正确");
      }
    });

    return data;
  }

  public static async getData([year, type]: [number[], string[]]): Promise<{
    [year: string]: { [type: string]: any };
  }> {
    // return new Promise((resolve, reject) => {
    //   resolve(TestData.test_primitive_data);
    // });

    if (year.length === 0 || type.length === 0)
      return new Promise((resolve, reject) => {
        resolve({});
      });

    const response = await axios({
      method: "post",
      url: Conf.api_prifix + "/GetIndicatorsByIndexNumsAndYears",
      data: {
        years: year,
        indexNums: type,
      },
      responseType: "json",
    });

    if (response.data.code !== 0) {
      console.error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`,
        {
          years: year,
          indexNums: type,
        },
        response.data
      );
      throw Error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`
      );
    }

    const data: Array<{
      year: number;
      indexNum: string;
      datas: Array<string>;
    }> = response.data.data.indicatorBriefs;

    if (typeof data !== "object") throw new Error("getData响应格式不正确");

    let converted_data: {
      [year: string]: {
        [type: string]: Array<number | null>;
      };
    } = {};

    data.forEach(({ year, indexNum, datas }) => {
      const year_str = year.toString();
      converted_data[year_str] = converted_data[year_str] ?? {};
      converted_data[year_str][indexNum] = datas.map((value) => {
        if (value === "null") return null;
        else return parseFloat(value);
      });
    });

    return converted_data;
  }

  public static async putData(
    type: string,
    year: number,
    month: number,
    data: number
  ): Promise<AxiosResponse<any, any>> {
    const response = await axios({
      method: "post",
      url: Conf.api_prifix + "/CreateOriginal",
      data: {
        indexNum: type,
        year,
        month,
        data,
      },
      responseType: "json",
    });

    if (response.data.code !== 0) {
      console.error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`,
        {
          indexNum: type,
          year,
          month,
          data,
        },
        response.data
      );
      throw Error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`
      );
    }

    return response;
  }

  public static async delData(id: number) {
    const response = await axios({
      method: "post",
      url: Conf.api_prifix + "/DeleteOriginalByID?id=" + id,
      data: { id },
      responseType: "json",
    });

    if (response.data.code !== 0) {
      console.error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`,
        {
          id,
        },
        response.data
      );
      throw Error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`
      );
    }

    return response;
  }

  public static async queryData({
    page,
    //TODO size不写死了，插个眼先
    size,
    filter,
    search,
    sort,
  }: {
    page: number;
    size?: number;
    filter?: string;
    search?: string;
    sort?: string;
  }) {
    const response = await axios({
      method: "get",
      url: Conf.api_prifix + "/GetOriginals",
      params: {
        page,
        size,
        filter,
        search,
        sort,
      },
      responseType: "json",
    });

    if (response.data.code !== 0) {
      console.error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`
      );
      throw Error(
        `Server Side Err: ${
          response.data?.message
        }(code: ${response.data?.code.toString()})`
      );
    }

    return response;
  }
}
