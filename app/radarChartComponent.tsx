import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Model from './utils/model';

interface RadarChartComponentProps {
  year: number;
  type: string;
  name:string;
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ year, type,name }) => {
  const chartRef = useRef<any>(null);

  const [chartData, setChartData] = useState<Map<string, number>>(new Map());

  function fetchDataAndMerge(year: number, type: string) {
    return Model.fetch({ year, type }).then((m) => {
      // 获取返回的函数
      const dataMap = m(year)(type);
      const processedDataMap = new Map(
        (Array.from(dataMap.entries()) as Array<[string, number]>).map(([key, value]) => [key, Number(value.toFixed(2))])
      );

    setChartData(processedDataMap);
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
  }, [year, type]);

  const getOption = () => {
    if (!chartData || chartData.size === 0) {
      // 如果 chartData 不存在或为空，返回一个空的选项
      return {
        title: {
          text: '',
        },
        legend: {
            show: false, 
        },
        radar: {
          indicator: [],
          radius: '50%',
        },
        series: [
          {
            name: '',
            type: 'radar',
            data: [],
          },
        ],
      };
    }

    return {
      title: {
        text: '',
      },
      legend: {
        show: false, 
      },
      radar: {
        indicator: Array.from(chartData.keys()).map((indicator) => ({
          name: indicator,
          max: 30,
        })),
        radius: '50%',
      },
      tooltip: {  
        trigger: 'item',
      },
      series: [
        {
          name: name,
          type: 'radar',
          data: [
            {
              value: Array.from(chartData.values()),
              name: '',
              lineStyle: {
                color: '#ff5733',
              },
            },
          ],
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

export default RadarChartComponent;
