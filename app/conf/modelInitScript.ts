/**
 * Cache初始化时运行
 * 请不要在其它位置导入
 */
import Data from "../utils/dataWrap";
import { PII } from "../utils/dataWrap";
import Cache from "../utils/cache";

import * as Conf from "./config";

// k向量
const k = Conf.k;

/**
 * 计算成本型指标
 * @param x x
 * @param number[3] 隶属度函数分段点
 */
function calcCostTypeLabel(
  x: number,
  [w1, w2, w3]: [number, number, number]
): number {
  // 隶属度
  // r1分量
  const r1 = x > w1 ? 1 : x <= w2 ? 0 : (x - w2) / (w1 - w2);
  // r2分量
  const r2 =
    x >= w2 && x <= w1
      ? (w1 - x) / (w1 - w2)
      : x > w3 && x < w2
      ? (x - w3) / (w2 - w3)
      : 0;
  // r3分量
  const r3 = x <= w3 ? 1 : x >= w2 ? 0 : (w2 - x) / (w2 - w3);
  // 效能指数
  return r1 * k[0] + r2 * k[1] + r3 * k[2];
}

/**
 * 计算收益型指标
 * @param x x
 * @param number[3] 隶属度函数分段点
 */
function calcBenefitTypeLabel(
  x: number,
  [w1, w2, w3]: [number, number, number]
): number {
  // 隶属度
  // r1分量
  const r1 = x < w1 ? 1 : x >= w2 ? 0 : (w2 - x) / (w2 - w1);
  // r2分量
  const r2 =
    x >= w1 && x <= w2
      ? (x - w1) / (w2 - w1)
      : x > w2 && x < w3
      ? (w3 - x) / (w3 - w2)
      : 0;
  // r3分量
  const r3 = x >= w3 ? 1 : x <= w2 ? 0 : (x - w2) / (w3 - w2);
  // 效能指数
  return r1 * k[0] + r2 * k[1] + r3 * k[2];
}

Conf.primary_field.forEach((value: Conf.PrimaryFieldLine) => {
  // C级指标实际值
  Cache.registField({
    name: value[0],
    origin: "primitive",
    deps: [],
    deplines: [],
    cache: "cache",
  });

  // C级指标的效能指数
  // Cache.registField({
  //   name: "%" + value[0],
  //   origin: "reference",
  //   deps: [value[0]],
  //   deplines: [0],
  //   cache: "cache",
  //   map: function (line, m, sig) {
  //     if (value[5] === "cost") {
  //       return new Data(
  //         m(line)(value[0]).$a.map((mon_value: number) => {
  //           if (mon_value === null) return null;
  //           return calcCostTypeLabel(mon_value, value[7]);
  //         })
  //       );
  //     } else if (value[5] === "benefit") {
  //       return new Data(
  //         m(line)(value[0]).$a.map((mon_value: number) => {
  //           if (mon_value === null) return null;
  //           return calcBenefitTypeLabel(mon_value, value[7]);
  //         })
  //       );
  //     }
  //   },
  // });
  Cache.registField({
    name: "%" + value[0],
    origin: "reference",
    deps: [value[0]],
    deplines: [0],
    cache: "cache",
    map: function (line, m, sig) {
      return m(line)(value[0]);
    },
  });
});

Conf.B_field.forEach((value: Conf.ABFieldLine) => {
  // B级指标
  // Cache.registField({
  //   name: value[0],
  //   origin: "reference",
  //   deps: value[2].map((c) => "%" + c),
  //   deplines: [0],
  //   cache: "cache",
  //   map: function (line, getter, sig) {
  //     let result: Array<number | null> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //     let m = getter(line);
  //     value[2].forEach((c, k) => {
  //       m("%" + c)
  //         //.meanInterp()
  //         .$a.forEach((v: number, i: number) => {
  //           if (v === null) {
  //             result[i] = null;
  //             return;
  //           }
  //           (result[i] as number) += v * value[3][k];
  //         });
  //     });
  //     return new Data(result);
  //   },
  // });
  Cache.registField({
    name: value[0],
    origin: "primitive",
    deps: [],
    deplines: [],
    cache: "cache",
  });

  // B级雷达图
  Cache.registField({
    name: value[0] + ".comp",
    origin: "reference",
    deps: value[2].map((c) => "%" + c),
    deplines: [0],
    cache: "cache",
    map: function (line, getter, sig) {
      let result = new Map();
      let m = getter(line);
      value[2].forEach((c, k) => {
        let sum = 0;
        let cnt = 0;
        m("%" + c).$a.forEach((v: number, i: number) => {
          sum += v === null ? 0 : v;
          if (v !== null) cnt++;
        });
        result.set(c, (sum / cnt) * value[3][k]);
      });
      return result;
    },
  });

  // 对最大值影响最大的
  Cache.registField({
    name: value[0] + ".maxMonInf",
    origin: "reference",
    deps: [value[0], ...value[2].map((c) => "%" + c)],
    deplines: [0],
    cache: "cache",
    map: function (line, getter, sig) {
      let result: string[] = [];
      const m = getter(line);
      const max_mon = m(value[0]).indexOf.max;
      value[2].forEach((c, k) => {
        if (m("%" + c).indexOf.max === max_mon) result.push(c);
      });
      return result;
    },
  });

  // 对最小值影响最大的
  Cache.registField({
    name: value[0] + ".minMonInf",
    origin: "reference",
    deps: [value[0], ...value[2].map((c) => "%" + c)],
    deplines: [0],
    cache: "cache",
    map: function (line, getter, sig) {
      let result: string[] = [];
      const m = getter(line);
      const min_mon = m(value[0]).indexOf.min;
      value[2].forEach((c, k) => {
        if (m("%" + c).indexOf.min === min_mon) result.push(c);
      });
      return result;
    },
  });
});

// A级指标
// Cache.registField({
//   name: "A",
//   origin: "reference",
//   deps: Conf.A_field[2].map((b) => b),
//   deplines: [0],
//   cache: "cache",
//   map: function (line, getter, sig) {
//     let result: Array<number | null> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//     let m = getter(line);
//     Conf.A_field[2].forEach((b, k) => {
//       m(b).$a.forEach((v: number, i: number) => {
//         if (v === null) {
//           result[i] = null;
//           return;
//         }
//         (result[i] as number) += v * Conf.A_field[3][k];
//       });
//     });
//     return new Data(result);
//   },
// });
Cache.registField({
  name: "A",
  origin: "primitive",
  deps: [],
  deplines: [],
  cache: "cache",
});

Cache.registField({
  name: "A.comp",
  origin: "reference",
  deps: Conf.A_field[2].map((b) => b),
  deplines: [0],
  cache: "cache",
  map: function (line, getter, sig) {
    let result = new Map();
    let m = getter(line);
    Conf.A_field[2].forEach((b, k) => {
      let sum = 0;
      let cnt = 0;
      m(b).$a.forEach((v: number, i: number) => {
        sum += v === null ? 0 : v;
        if (v !== null) cnt++;
      });
      result.set(b, (sum / cnt) * Conf.A_field[3][k]);
    });
    return result;
  },
});

// 对最大值影响最大的
Cache.registField({
  name: "A.maxMonInf",
  origin: "reference",
  deps: ["A", ...Conf.primary_field.map((c) => "%" + c[0])],
  deplines: [0],
  cache: "cache",
  map: function (line, getter, sig) {
    let result: string[] = [];
    const m = getter(line);
    const max_mon = m("A").indexOf.max;
    Conf.primary_field.forEach((c, k) => {
      if (m("%" + c[0]).indexOf.max === max_mon) result.push(c[0]);
    });
    return result;
  },
});

// 对最小值影响最大的
Cache.registField({
  name: "A.minMonInf",
  origin: "reference",
  deps: ["A", ...Conf.primary_field.map((c) => "%" + c[0])],
  deplines: [0],
  cache: "cache",
  map: function (line, getter, sig) {
    let result: string[] = [];
    const m = getter(line);
    const min_mon = m("A").indexOf.min;
    Conf.primary_field.forEach((c, k) => {
      if (m("%" + c[0]).indexOf.min === min_mon) result.push(c[0]);
    });
    return result;
  },
});

Cache.registField({
  name: "A.GRAmax5",
  origin: "reference",
  deps: ["A", ...Conf.primary_field.map((c) => "%" + c[0])],
  deplines: [0],
  cache: "cache",
  map: function (line, getter, sig) {
    let result: string[] = [];
    const m = getter(line);
    const A = m("A").meanInterp();
    const matrix = new Map();
    Conf.primary_field.forEach((c, k) => {
      matrix.set(
        c[0] + "(" + c[1] + "(" + c[6] + "))",
        m("%" + c[0]).meanInterp()
      );
    });
    const GRAresult: Map<string, PII<number, string>> = A.GRA(matrix);
    let sort: PII<number, string>[] = [];
    GRAresult.forEach((v, k) => {
      sort.push(v);
    });
    sort.sort((v1, v2) => {
      return v2.first - v1.first;
    });
    for (let i = 0; i < 5; i++) result.push(sort[i].second);
    return result.sort();
  },
});

const NULL = null;

export default NULL;
