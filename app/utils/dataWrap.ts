/**
 * @module 数据包装器
 */

// jStat统计学库
import jstat from "../lib/jstat";
const jStat: any = jstat;

// pair
export class PII<T, K> {
  public first: T;
  public second: K;
  public constructor(first: T, second: K) {
    this.first = first;
    this.second = second;
  }
}

/**
 * @class 数据包装器
 */
export class Data {
  private data: Array<number> = [];
  private cache: Map<string, any> = new Map();

  public size: number;
  public meta: any;

  public constructor(data: any) {
    if (typeof data?.$a === "object") this.data = data.$a;
    this.data = Array.from(data);
    this.size = this.data.length;
  }

  /**
   * @desc 导出为数组
   */
  public get(): Array<number> {
    return this.data.slice();
  }

  /**
   * @desc 赋值
   */
  public set(data: Array<number>) {
    this.data = data.slice();
    this.cache.clear();
    this.size = this.data.length;
  }

  /**
   * @desc 导出为数组
   */
  public get $a(): Array<number> {
    return this.get();
  }

  /**
   * @desc 最大值
   * @readonly
   */
  public get max(): number {
    if (this.cache.has("max")) return this.cache.get("max") as number;
    if (this.size === 0) throw Error("长度为0的序列无法取最大值");
    let max = Math.max(...this.no_null.$a);
    let maxi = this.data.indexOf(max);
    this.cache.set("max", max).set("maxi", maxi);
    return max;
  }

  /**
   * @desc 最小值
   * @readonly
   */
  public get min(): number {
    if (this.cache.has("min")) return this.cache.get("min") as number;
    if (this.size === 0) throw Error("长度为0的序列无法取最小值");
    let min = Math.min(...this.no_null.$a);
    let mini = this.data.indexOf(min);
    this.cache.set("min", min).set("mini", mini);
    return min;
  }

  /**
   * @desc 总和
   * @readonly
   */
  public get sum(): number {
    if (this.cache.has("sum")) return this.cache.get("sum") as number;
    let sum = 0;
    for (const value of this.data) {
      sum += value;
    }
    this.cache.set("sum", sum);
    return sum;
  }

  /**
   * @desc 平均值
   * @readonly
   */
  public get ave(): number {
    if (this.cache.has("ave")) return this.cache.get("ave") as number;
    if (this.size === 0) throw Error("长度为0的序列无法取平均值");
    let ave = this.sum / this.size;
    this.cache.set("ave", ave);
    return ave;
  }

  /**
   * @desc 中位数
   * @readonly
   */
  public get median(): number {
    if (this.cache.has("med")) return this.cache.get("med") as number;
    let sort = this.sort.$a;
    let len = sort.length;
    if (len === 0) throw Error("长度为0的序列无法取中位数");
    let med: number, medi: number | PII<number, number>;
    if (len & 1) {
      med = sort[(len / 2) | 0];
      medi = this.data.indexOf(med);
    } else {
      med = (sort[len / 2 - 1] + sort[len / 2]) / 2;
      medi = new PII(
        this.data.indexOf(sort[len / 2 - 1]),
        this.data.indexOf(sort[len / 2])
      );
    }
    this.cache.set("med", med).set("medi", medi);
    return med;
  }

  /**
   * @desc 方差
   * @readonly
   */
  public get variance(): number {
    if (this.cache.has("var")) return this.cache.get("var") as number;
    if (this.size === 0) throw Error("长度为0的序列无法取方差");
    const n = this.size;
    const ave = this.ave;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += Math.pow(this.data[i] - ave, 2);
    }
    this.cache.set("var", sum / n);
    return sum / n;
  }

  /**
   * @desc 标准差
   * @readonly
   */
  public get stdev(): number {
    if (this.cache.has("std")) return this.cache.get("std") as number;
    if (this.size === 0) throw Error("长度为0的序列无法取标准差");
    let std = Math.sqrt(this.variance);
    this.cache.set("std", std);
    return std;
  }

  /**
   * @desc 极差
   * @readonly
   */
  public get range(): number {
    return this.max - this.min;
  }

  /**
   * @desc 排序
   * @readonly
   */
  public get sort(): Data {
    if (this.cache.has("sort"))
      return new Data(Array.from(this.cache.get("sort")));
    let sort = [...this.data];
    sort.sort();
    this.cache.set("sort", sort);
    return new Data(sort);
  }

  /**
   * @desc 绝对值
   * @readonly
   */
  public get abs(): Data {
    if (this.cache.has("abs"))
      return new Data(Array.from(this.cache.get("abs")));
    let abs = this.data.map((value) => {
      return value < 0 ? -value : value;
    });
    this.cache.set("abs", abs);
    return new Data(abs);
  }

  /**
   * @desc 导出为无null数组
   */
  public get no_null(): Data {
    if (this.cache.has("no-null"))
      return new Data(Array.from(this.cache.get("no-null")));
    let no_null: number[] = [];
    this.data.forEach((value) => {
      if (value !== null) no_null.push(value);
    });
    this.cache.set("no-null", no_null);
    return new Data(no_null);
  }

  // 下标
  public get indexOf() {
    const that = this;
    return {
      get max(): number {
        if (that.cache.has("maxi")) return that.cache.get("maxi") as number;
        let max = Math.max(...that.no_null.$a);
        let maxi = that.data.indexOf(max);
        that.cache.set("max", max).set("maxi", maxi);
        return maxi;
      },

      get min(): number {
        if (that.cache.has("mini")) return that.cache.get("mini") as number;
        let min = Math.min(...that.no_null.$a);
        let mini = that.data.indexOf(min);
        that.cache.set("min", min).set("mini", mini);
        return mini;
      },

      get median(): number | PII<number, number> {
        if (that.cache.has("medi"))
          return that.cache.get("medi") as number | PII<number, number>;
        let sort = that.sort.$a;
        let len = sort.length;
        if (len === 0) throw Error("长度为0的序列无法取中位数");
        let med: number, medi: number | PII<number, number>;
        if (len & 1) {
          med = sort[(len / 2) | 0];
          medi = that.data.indexOf(med);
        } else {
          med = (sort[len / 2 - 1] + sort[len / 2]) / 2;
          medi = new PII(
            that.data.indexOf(sort[len / 2 - 1]),
            that.data.indexOf(sort[len / 2])
          );
        }
        that.cache.set("med", med).set("medi", medi);
        return med;
      },
    };
  }

  /**
   * @desc 定值插值处理
   * @param value 插入的值
   * @returns 插值处理后的数据
   */
  public interp(value: number): Data {
    return new Data(
      this.data.map((v) => {
        if (v === null) {
          return value;
        } else {
          return v;
        }
      })
    );
  }

  /**
   * @desc 均值插值处理
   * @returns 插值处理后的数据
   */
  public meanInterp(): Data {
    let sum = 0;
    let cnt = 0;
    this.data.forEach((value) => {
      if (value !== null) {
        sum += value;
        cnt++;
      }
    });
    const ave = sum / cnt;
    if (isNaN(ave)) {
      throw Error("不应对空序列插值");
    }
    return new Data(
      this.data.map((value) => {
        if (value === null) {
          return ave;
        } else {
          return value;
        }
      })
    );
  }

  /**
   * @desc 趋势分析
   * @readonly
   */
  public get trend(): {
    trend: -1 | 0 | 1; // 趋势
    mono: -1 | 0 | 1 | null; // 单调性
    uds: number; // 一阶向后差分绝对值之和
    amp: number; // 加权震荡指数
  } {
    if (this.cache.has("trend")) {
      let result = {};
      Object.assign(result, this.cache.get("trend"));
      return result as any;
    }

    const slr = this.SLRA();
    const trend: -1 | 0 | 1 = slr.slop === 0 ? 0 : slr.slop > 0 ? 1 : 0;
    // 无符号差分和
    let uds = 0;
    for (let i = 1; i < this.size; i++) {
      uds += Math.abs(this.data[i] - this.data[i - 1]);
    }
    // 单调性
    const variation = Math.abs(this.data[this.size - 1] - this.data[0]);
    let mono: -1 | 0 | 1 | null, amp;
    if (uds === variation) {
      mono = trend;
      amp = 1;
    } else {
      mono = null;
      amp = variation / uds;
    }

    const result = {
      trend,
      mono,
      uds,
      amp,
    };

    this.cache.set("trend", result);
    return result;
  }

  /**
   * @desc 线性回归分析 - Simple Linear Regress Analysis
   * @param x 自变量
   * @warring 调用者自行确保数据合法
   * @warring 未考虑回归曲线垂直的情况
   */
  public SLRA(x?: Data): {
    n: number; // 样本数
    slop: number; // 斜率
    intercept: number; // 截距
    sse: number; // 残差平方和
    var_slop: number; // 回归系数方差估计值
    t_0: number; // t值
    p_value: number; // p值
    estimatedLRE: (x: number) => number; // 线性回归方程
  } {
    if (typeof x !== "undefined") return this.linearRegressWith(x);
    // 以索引为自变量
    if (this.cache.has("slra")) {
      let result = {};
      Object.assign(result, this.cache.get("slra"));
      return result as any;
    }
    const n = this.size;
    const ave = this.ave;
    // range(0, n-1)
    // 区间均值
    const range_mean = (n - 1) / 2;
    // 平方和
    const range_nxVar =
      (range_mean * (range_mean + 1) * (2 * range_mean + 1)) / 3;
    // 区间与因变量的协方差分子
    let nxCov_xy = 0;
    for (let i = 0; i < n; i++) {
      nxCov_xy += (this.data[i] - ave) * (i - range_mean);
    }
    // 与下同
    const slop = nxCov_xy / range_nxVar;
    const intercept = this.ave - slop * range_mean;
    const estimatedLRE = (x: number) => x * slop + intercept;
    let sse = 0;
    for (let i = 0; i < n; i++) {
      sse += Math.pow(estimatedLRE(i) - this.data[i], 2);
    }
    const var_slop = Math.sqrt(((1 / (n - 2)) * sse) / range_nxVar);
    const t_0 = (slop - 0) / var_slop;
    const p_value =
      (t_0 > 0 ? t_0 : -t_0) === Infinity ? 0 : jStat.ttest(t_0, n - 2, 2);

    const result = {
      n,
      slop,
      intercept,
      estimatedLRE,
      sse,
      var_slop,
      t_0,
      p_value,
    };

    this.cache.set("slra", result);
    return result;
  }

  private linearRegressWith(x: Data): {
    n: number; // 样本数
    slop: number; // 斜率
    intercept: number; // 截距
    sse: number; // 残差平方和
    var_slop: number; // 回归系数方差估计值
    t_0: number; // t值
    p_value: number; // p值
    estimatedLRE: (x: number) => number; // 线性回归方程
  } {
    // @description 计算方式：

    // 回归方程
    // ```math
    // y=\beta_0+\beta_{1}x+\varepsilon
    // ```
    // 截距
    // ```math
    // \hat{\beta_0}=\bar{y}-\hat{\beta_1}\bar{x}
    // ```
    // 斜率/回归系数
    // ```math
    // \hat{\beta_1}=\frac{\sum_{i=1}^{i=n}(x_i-\bar{x})(y_i-\bar{y})}{\sum_{i=1}^{i=n}(x_i-\bar{x})^2}
    // ```
    // 假定$\hat\beta=\beta$的t-score
    // ```math
    // t=\frac{\hat{\beta}-\beta}{s_{\hat\beta}}
    // ```
    // $\hat\beta$的估计方差
    // ```math
    // s_{\hat\beta}=\sqrt{\frac{\frac{1}{n-2}\sum_{i=1}^{i=n}\hat{\varepsilon}^2}{\sum_{i=1}^{i=n}(x_i-\bar{x})^2}}
    // ```
    // $\beta$的置信区间
    // ```math
    // \left[\hat{\beta}-s_{\hat{\beta}}t^*_{n-2},\hat{\beta}+s_{\hat{\beta}}t^*_{n-2}\right]\\
    // t^*_{n-2}=Tinv(*,n-2)
    // ```
    // 进行t-test，获得p值
    // ```math
    // Ttest(t_0, n-2, 2)
    // ```
    // $t_0$是假定$\beta=0$时的t-score，因为是双边检验，所以自由度是$n-2$

    const x_arr = x.$a;
    // 样本数
    const n = this.size;
    // 斜率
    const slop = this.cov(x) / x.variance;
    // 截距，回归系数
    const intercept = this.ave - slop * x.ave;
    // 推测线性回归方程
    const estimatedLRE = (x: number) => x * slop + intercept;
    // 残差平方和
    let sse = 0;
    for (let i = 0; i < n; i++) {
      sse += Math.pow(estimatedLRE(x_arr[i]) - this.data[i], 2);
    }
    // 回归系数估计方差
    const var_slop = Math.sqrt(((1 / (n - 2)) * sse) / (n * x.variance));
    // 假定回归系数=0时的t值
    const t_0 = (slop - 0) / var_slop;
    // 双侧检验的p值
    const p_value =
      (t_0 > 0 ? t_0 : -t_0) === Infinity ? 0 : jStat.ttest(t_0, n - 2, 2);

    return {
      n,
      slop,
      intercept,
      estimatedLRE,
      sse,
      var_slop,
      t_0,
      p_value,
    };
  }

  /**
   * @desc 灰色相关性分析
   * @param subseqs 子序列
   * @param rho 分辨系数
   * @returns 灰色关联系数
   * @warring 调用者自行确保可合法初值化
   * @warring 调用者自行确保序列长度相同
   * @warring 存在精度问题
   */
  public GRA(
    subseqs: Map<any, Data>,
    rho: number = 0.5
  ): Map<any, PII<number, any>> {
    // @description 计算方式：

    // 灰色关联系数公式：
    // ```math
    // \zeta_i(k)=\frac{GlobalMin+\rho\cdot GlobalMax}{|x_0(k)-x_i(k)|+\rho\cdot GlobalMax}\\
    // GlobalMin = \min_i\min_k|x_0(k)-x_i(k)|\\
    // GlobalMax = \max_i\max_k|x_0(k)-x_i(k)|\\
    // ```
    // $x_0$是母序列，$x_i$是子序列，$\zeta_i(k)$是子序列$x_i$第$k$个元素相对于母序列的灰色关联系数。
    // 最终的关联度排序由各序列所有元素的平均关联系数决定。

    const matrix: Map<any, Array<number>> = new Map();
    const target = this.data.map((value) => {
      return value / this.data[0];
    });
    const len = target.length;

    subseqs.forEach((line, key) => {
      matrix.set(
        key,
        line.$a.map((value) => {
          return value / line.$a[0];
        })
      );
    });

    let globalMax = -Infinity,
      globalMin = Infinity;
    matrix.forEach((line, key) => {
      matrix.set(
        key,
        line.map((value, key) => {
          const diff = Math.abs(value - target[key]);
          if (globalMax < diff) globalMax = diff;
          if (globalMin > diff) globalMin = diff;
          return diff;
        })
      );
    });

    const result: Map<any, PII<number, any>> = new Map();
    matrix.forEach((line, key) => {
      let line_sum = 0;
      line.forEach((value) => {
        line_sum += (globalMin + rho * globalMax) / (value + rho * globalMax);
      });
      result.set(key, new PII(line_sum / len, key));
    });

    return result;
  }

  /**
   * @desc 同比增长率
   * @param base 基底
   * @returns 返回由结果组成的数组
   */
  public growthRate(base: Data): Data {
    const prev = base.$a;
    return new Data(
      this.data.map((value, i) => {
        if (prev[i] === null || value === null) return null;
        return (value - prev[i]) / prev[i];
      })
    );
  }

  /**
   * @desc 皮尔逊相关系数
   * @param that 另一个值
   * @returns 返回相关系数
   * @warring 调用者自行保证不为非法数据
   */
  public corr(that: Data): number {
    return this.cov(that) / (this.stdev * that.stdev);
  }

  /**
   * @desc 协方差
   * @param that 另一个值
   * @returns 返回协方差
   */
  public cov(that: Data): number {
    const n = this.size;
    const that_arr = that.$a;
    const this_ave = this.ave;
    const that_ave = that.ave;
    let sum = 0;
    if (that.size !== n) throw Error("数目不同的两组数据无法求协方差");
    for (let i = 0; i < n; i++) {
      sum += (this.data[i] - this_ave) * (that_arr[i] - that_ave);
    }
    return sum / n;
  }
}

export default Data;
