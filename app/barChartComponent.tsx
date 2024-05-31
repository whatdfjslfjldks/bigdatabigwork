import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Model from './utils/model';

interface ChartComponentProps {
  year: number;
  type: string;
}

const BarChartComponent: React.FC<ChartComponentProps> = ({ year, type }) => {
  const chartRef = useRef<any>(null);

  const [chartData, setChartData] = useState<Array<{ month: any; value: number }>>([]);

  function fetchDataAndMerge(year: number, type: string) {
    // model.fetch()参数已改，现在既可以传数组也可以传值
    // 一次可以多传几个year, type进去，可以减少请求次数
    return Model.fetch({ year, type }).then((m) => {
      // 获取返回的函数
      const getDataFunction = m(year);

      // 调用返回的函数并返回数据
      const rawData = getDataFunction(type);

      // 确保 rawData 是数组，如果不是，将其放入数组中
      const newData = Array.isArray(rawData?.$a) ? rawData.interp(0).$a : [rawData];

      // 获取新的 chartData，假设 newData 是一个包含数据的数组
      const newChartData = newData.map((value: any, index: any) => ({
        month: `${index + 1}月`,
        value: Number(value.toFixed(2)), // 将 value 转换为最多包含两位小数的数字
      }));

      // 返回新的 chartData
      return newChartData;
    });
  }

  useEffect(() => {
    const fetchDataAndSetChartData = async () => {
      try {
        const newChartData = await fetchDataAndMerge(year, type);
        setChartData(newChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndSetChartData();
  }, []); // 空数组作为依赖项，确保只在组件挂载时调用一次


  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        x: 46,
        y: 35,
        x2: 30,
        y2: 25,
        borderWidth: 0,
      },
      calculable: false,
      legend: {
        data: ['效能指数'],
        textStyle: {
          color: '#e9ebee',
        },
      },
      xAxis: [
        {
          type: 'category',
          data: chartData.map((item) => item.month),
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#a4a7ab',
              align: 'center',
            },
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: 'white',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '效能指数（%）',
          min: 0,
          max: 100,
          nameTextStyle: {
            color: '#1afffd',
          },
          axisLabel: {
            formatter: '{value} ',
            textStyle: {
              color: '#a4a7ab',
              align: 'right',
            },
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'white',
            },
          },
        },
      ],
      series: [
        {
          name: '效能指数',
          type: 'bar',
          barWidth: 10,
          data: chartData.map((item) => item.value),
          itemStyle: {
            color: '#0ad5ff',
          },
        },
        {
          name: '效能指数折线',
          type: 'line',
          yAxisIndex: 0,
          data: chartData.map((item) => item.value),
          itemStyle: {
            color: '#1afffd',
          },
          tooltip: {
            show: false,
          }
        },
      ],
    };
  };

  return (
    <ReactECharts
      ref={chartRef}
      option={getOption()}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default BarChartComponent;
