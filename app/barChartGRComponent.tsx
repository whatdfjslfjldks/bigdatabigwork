import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Model from './utils/model';

interface ChartGRComponentProps {
  year: number;
  type: string;
}

const BarChartGRComponent: React.FC<ChartGRComponentProps> = ({ year, type }) => {
  const chartRef = useRef<any>(null);

  const [chartData, setChartData] = useState<Array<{ month: any; value1: number; value2: number }>>([]);

  function fetchDataAndMerge(year: number, type: string) {
    return Model.fetch({ year, type }).then((m) => {
      const first = Model.year.length > 0 ? Model.year[0] : 0;
      const getDataFunction = m(year);
      const rawData = getDataFunction(type);

      const newData = Array.isArray(rawData?.$a) ? rawData.interp(0).$a : [rawData];

      if (first !== year) {
        const GRData = Array.isArray(rawData.growthRate(m(year - 1)(type))?.$a) ? rawData.growthRate(m(year - 1)(type)).interp(0).$a : [rawData.growthRate(m(year - 1)(type))];

        const combinedData = newData.map((item: any, index: any) => ({
          value1: Number(item.toFixed(2)),
          value2: GRData[index] ? Number((GRData[index]) * 100).toFixed(2) : 0,
        }));

        const newChartData = combinedData.map((value: any, index: any) => {
          return {
            month: `${index + 1}月`,
            value1: value.value1,
            value2: value.value2,
          };
        });

        return newChartData;
      } else {
        const newChartData = newData.map((value: any, index: any) => {
          return {
            month: `${index + 1}月`,
            value1: Number(value.toFixed(2)),
            value2: null,
          };
        });
        return newChartData;
      }

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
  }, []);

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
        containLabel: true,
      },
      calculable: false,
      legend: {
        data: ['效能指数', '同比'],
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
          boundaryGap: true,
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
          boundaryGap: true,
        },
        {
          type: 'value',
          name: '同比增长率（%）',
          min: -50,
          max: 50,
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
          boundaryGap: true,
        },
      ],

      series: [
        {
          name: '效能指数',
          type: 'bar',
          barWidth: 10,
          data: chartData.map((item) => item.value1),
          itemStyle: {
            color: '#0ad5ff',
          },
          yAxisIndex: 0,
        },
        {
          name: '效能指数折线',
          type: 'line',
          yAxisIndex: 0,
          data: chartData.map((item) => item.value1),
          itemStyle: {
            color: '#1afffd',
          },
          tooltip: {
            show: false,
          }
        },
        {
          name: '同比',
          type: 'bar',
          barWidth: 10,
          data: chartData.map((item) => item.value2),
          itemStyle: {
            color: '#f15955',
          },
          yAxisIndex: 1,
          markLine: {
            symbol: ['none', 'none'], // 去掉箭头
            label: {
              show: false,
              position: 'start',
              formatter: '{b}'
            },
            data: [
              {
                name: '',
                yAxis: 0
              }
            ],
            lineStyle: {
              color: '#fff'
            }
          }
        },
        {
          name: '同比折线',
          type: 'line',
          yAxisIndex: 1,
          data: chartData.map((item) => item.value2),
          itemStyle: {
            color: '#ff7171',
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

export default BarChartGRComponent;

