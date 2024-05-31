import React, { useState, useEffect } from 'react';
import Model from './utils/model';
import {Button} from 'antd';
import docxtpl from './utils/docxtpl';

interface InfoBoxProps {
  type: string;
  year: number;
}

const InfoBox: React.FC<InfoBoxProps> = ({ type, year }) => {
  const [ave, setAve] = useState<number>(0);
  const [stdev, setStdev] = useState<number>(0);
  const [max, setMax] = useState<number>(0);
  const [min, setMin] = useState<number>(0);
  const [median, setMedian] = useState<number>(0);
  const [trend, setTrend] = useState<{ amp: number }>({ amp: 0 });
  const [variance, setVariance] = useState<number>(0);
  const [indexOfMax, setIndexOfMax] = useState<number>(0);
  const [grMax, setgrMax] = useState<number>(0);

  const [minMonInf, setMinMonInf] = useState<string[]>([]);
  const [maxMonInf, setMaxMonInf] = useState<string[]>([]);
  const [GRAmax5, setGRAmax5] = useState<string[]>([]);

  function fetchDataAndMerge(year: number, type: string) {
    return Model.fetch({
      year,
      type: (
        type[0] === "%" ?
          type
          : type === "A" ?
            ["A", "A.maxMonInf", "A.minMonInf", "A.GRAmax5"]
            : [type, type + ".maxMonInf", type + ".minMonInf"]
      )
    }).then((m) => {
      // 获取返回的函数
      const getDataFunction = m(year);

      // 调用返回的函数并返回数据
      const rawData = getDataFunction(type);

      setAve(rawData.ave.toFixed(2));
      setStdev(rawData.stdev.toFixed(2));
      setMax(rawData.max.toFixed(2));
      setMin(rawData.min.toFixed(2));
      setMedian(rawData.median.toFixed(2));
      setTrend({ amp: rawData.trend.amp.toFixed(2) });
      setVariance(rawData.variance.toFixed(2));

      const first = Model.year.length > 0 ? Model.year[0] : 0;
      if (year !== first) {
        setIndexOfMax(rawData.growthRate(m(year - 1)(type)).indexOf.max + 1);//同比最大月
        setgrMax(rawData.growthRate(m(year - 1)(type)).max);
      }

      if (type === "A" || (type >= "B1" && type <= "B6")) {
        const maxMF = getDataFunction(type + ".maxMonInf").join(' ');
        const minMF = getDataFunction(type + ".minMonInf").join(' ');

        setMaxMonInf(maxMF);
        setMinMonInf(minMF);
      }

      if (type === 'A') {
        const G5 = getDataFunction("A.GRAmax5").join('、');
        setGRAmax5(G5);
      }

      return rawData;

    });
  }

  useEffect(() => {
    const fetchDataAndSetChartData = async () => {
      try {
        await fetchDataAndMerge(year, type);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndSetChartData();
  }, []); // 空数组作为依赖项，确保只在组件挂载时调用一次

  function handleExportClick(){
    docxtpl.registTpl("report.docx");
docxtpl.use("report.docx")
.make("report.docx",
{ head: '分析报告' },
 {GRAmax5:"前五个对综合效能A关联度最大的指标:"+GRAmax5,
 ave:"平均值:"+ave,
 stdev:"标准差:"+stdev,
 max:"最大值:"+max,
 min:"最小值:"+min,
 median:"中位数:"+median,
 trend:"震荡程度Amp:"+trend.amp,
 variance:"方差:"+variance,
 indexOfMax:"同比最大的月份:"+indexOfMax,
 grMax:"同比值:"+grMax,
 minMonInf:"对综合效能指标最高值影响最小的C级指标:"+minMonInf,
 maxMonInf:"对综合效能指标最高值影响最大的C级指标:"+maxMonInf,
},
 );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    {
      (type === 'A') && (
        <p style={{ color: 'white' }}>前五个对综合效能A关联度最大的指标:{GRAmax5}</p>
      )
    }
    <p style={{ color: 'white' }}>平均值: {ave}</p>
    <p style={{ color: 'white' }}>标准差: {stdev}</p>
    <p style={{ color: 'white' }}>最大值: {max}</p>
    <p style={{ color: 'white' }}>最小值: {min}</p>
    <p style={{ color: 'white' }}>中位数: {median}</p>
    <p style={{ color: 'white' }}>震荡程度Amp: {trend.amp}</p>
    <p style={{ color: 'white' }}>方差: {variance}</p>
    <p style={{ color: 'white' }}>同比最大的月份: {indexOfMax}</p>
    <p style={{ color: 'white' }}>同比值: {grMax}</p>
    {(type === "A" || (type >= "B1" && type <= "B6")) && (
      <>
        <p style={{ color: 'white' }}>对综合效能指标最高值影响最小的C级指标: {minMonInf}</p>
        <p style={{ color: 'white' }}>对综合效能指标最高值影响最大的C级指标: {maxMonInf}</p>
      </>
    )}
    <div style={{ alignSelf: 'flex-end', marginTop: '10px' }}>
      <Button onClick={handleExportClick} style={{ backgroundColor: '#1890ff', color: '#fff' }}>导出</Button>
    </div>
  </div>
  
  );
};

export default InfoBox;
