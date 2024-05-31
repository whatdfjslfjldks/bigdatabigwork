'use client'
import React, { useState, useEffect } from 'react';
import { Layout, Flex, Select } from 'antd';
import Image from 'next/image';
import { Link } from 'react-router-dom';
import Model from './utils/model';
import BarChartComponent from './barChartComponent';
import BarChartGRComponent from './barChartGRComponent';
import RadarChartComponent from './radarChartComponent';
import InfoBox from './InfoBox';
import header_title from '../public/pic/header-title.png';
import * as Conf from "./conf/config";

interface UiProps {
  index_num: string;
}
const Ui: React.FC<UiProps> = ({ index_num }) => {
  const { Header, Content } = Layout;
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [barChartKey, setBarChartKey] = useState<number>(Date.now());
  const [detailsType, setDetailsType] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>();
  const [yearOptions, setYearOptions] = useState<{ value: number; label: string; }[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100vh',
    maxWidth: '100vw',
    backgroundColor: '#0b0f34',
    color: 'white',
  };
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '3vw',
    lineHeight: '5vw',
    backgroundColor: '#0b0f34',
  };
  const contentStyle: React.CSSProperties = {
    flex: 1,
    // overflow:'hidden',
    background: 'url("/pic/wrapper-bg.png")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '99% 100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '1vw',
    paddingTop: '4vw',
  };
  const contentHeaderStyle: React.CSSProperties = {
    position: 'fixed',
    color: 'white',
    top: '4vw',
    left: '8vw',
    fontSize: '1.3vw',
    fontFamily: "'Microsoft YaHei', 'Arial', sans-serif",
    zIndex: 999, // 确保位于其他元素之上
  };
  const leftStyle: React.CSSProperties = {
    // overflow:'hidden',
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor:'red',
    left: '1vw',
    width: '30vw',
    height: '100vh',
    gap: '1vw',
    paddingBottom: '9vw',
  };
  const left1Style: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    height: '0',
    // overflow:'hidden',
    background: 'url("/pic/border.png")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '95% 100%',
    // paddingLeft: '4vw',
    alignItems: 'left',
    marginRight: '-1vw',
    marginLeft: '2vw',
    // color: 'white',
  };

  const middleStyle: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    width: '30vw',
    // backgroundColor:'white',
    height: '100vh',
    gap: '1vw',
    paddingBottom: '9vw',
  }
  const middle1Style: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    background: 'url("/pic/border.png")',
    width: '40vw',
    backgroundPosition: "center",
    backgroundRepeat: 'no-repeat',
    backgroundSize: '90% 100%',
    alignItems: 'left',
    paddingLeft: '1.3vw',
    paddingRight: '1.3vw',
    color: "white",
  }
  const rightStyle: React.CSSProperties = {
    display: 'flex',
    right: '1vw',
    flexDirection: 'column',
    // backgroundColor:'white',
    width: '30vw',
    height: '100vh',
    gap: '1vw',
    paddingBottom: '9vw',
  }
  const right1Style: React.CSSProperties = {
    flex: '1',
    display: 'flex',
    height: '0',
    flexDirection: 'column',
    background: 'url("/pic/border.png")',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '95% 100%',
    // paddingRight: '4vw',
    alignItems: 'left',
    marginLeft: '-1vw',
    marginRight: '2vw',
    // color: 'white',
  };
  const linkStyle = {
    backgroundColor: '#1890ff',
    padding: '0.4vw',
    fontSize: '1vw',
    textDecoration: 'none',
    color: 'white',
    border: '1px solid #1890ff',
    borderRadius: '8px',
  };
  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 999,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    // backgroundColor:'white',
  };
  const modalContentStyle: React.CSSProperties = {
    // backgroundColor: '#fff',
    overflow: 'hidden',
    margin: '2% auto',
    padding: '20px',
    borderRadius: '5px',
    height: '95%',
    width: '36%',
    backgroundColor: 'rgba(16, 45, 134, 0.8)',
  };


  const handleDetailsClick = (type: string) => {
    // console.log('detailsClick');
    setDetailsType(type);
    setOpen(true);
  }
  const handleCancel = () => {
    // console.log('cancel');
    setOpen(false);
    setIsFocused(false);
  };

  const renderCustomComponent = (type: string, mainText?: string, details?: string) => {
    return (
      <div
        style={{
          background: 'url("/pic/title-bg.png")',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginLeft: '0.7vw',
          paddingLeft: '2vw',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {["B1", "B2", "B3", "B4", "B5", "B6"].includes(type) ? (
            <Link to={`/${type}`}>
              <span style={{ color: 'white', fontSize: '16px',letterSpacing: '0.1vw' }}>{mainText}</span>
            </Link>
          ) : (
            <span style={{color: 'white', fontSize: '16px',letterSpacing: '0.1vw' }}>{mainText}</span>
          )}
          <span onClick={() => handleDetailsClick(type)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ color: 'white',fontSize: '12px', marginLeft: '8px', cursor: isHovered ? 'pointer' : 'auto', }}>{details}</span>
        </div>
      </div>
    );
  };



  const handleSelectedYear = (value: number) => {
    setSelectedYear(value);
    setBarChartKey(Date.now());
    sessionStorage.setItem('selectedYear', String(value));
  }
  useEffect(() => {
    const storedYear = sessionStorage.getItem('selectedYear');
    if (storedYear) {
      // console.log("本地存储变化" + storedYear)
      setSelectedYear(Number(storedYear));
    }
  }, []); // 空数组表示只在组件挂载时运行一次

  useEffect(() => {
    rerenderBarChart();
  }, [selectedYear]);
  const rerenderBarChart = () => {
    setBarChartKey(Date.now());
  };

  useEffect(() => {
    const yearOptions = Model.year.map((year) => ({
      value: year,
      label: `${year}`,
    }));
    setYearOptions(yearOptions);
  }, [Model.year]);


  const handleBackgroundClick = (e: React.MouseEvent) => {
    // 判断点击的元素是否是模态框外部的背景层
    if (e.target === e.currentTarget) {
      setOpen(false);
      setIsFocused(false);
    }
  };
  const closeIconStyle: React.CSSProperties = {
    // backgroundColor:'red',
    marginTop: '-1vw',
    zIndex: '999',
    color: isFocused ? 'black' : '#aaa',
    float: 'right',
    fontSize: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };


  const handleMouseOver = () => {
    setIsFocused(true);
  };
  const handleMouseOut = () => {
    setIsFocused(false);
  };
  return (
    <Flex gap="middle" wrap="wrap">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          {/* <Image src={header_title}
            alt='header-title'
            style={{ width: 'auto', height: '5vw' }}
            priority /> */}
     <div style={{backgroundColor: 'transparent', color: 'white', fontSize: '24px', padding: '20px', margin: '10px'}}>
    <h1 style={{color: 'white'}}>啤酒厂综合效能数据展板</h1>
    </div>
        </Header>
        <Content style={contentStyle}>
          {open && (
            <div className="modal" style={modalStyle} onClick={handleBackgroundClick}>
              <div className="modal-content" style={modalContentStyle}>
                <span onClick={handleCancel}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  style={closeIconStyle}>&times;</span>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '20vw' }}>

                  {selectedYear && (detailsType === 'A' || ["B1", "B2", "B3", "B4", "B5", "B6"].includes(detailsType)) ?
                    (<BarChartGRComponent key={barChartKey} year={selectedYear!} type={detailsType} />) :
                    (<BarChartComponent key={barChartKey} year={selectedYear!} type={detailsType} />)
                  }
                </div>

                <InfoBox type={detailsType} year={selectedYear!} />
              </div>
            </div>
          )}

          <div style={contentHeaderStyle}>
            请选择年份:&nbsp;&nbsp;
            <Select
              defaultValue={selectedYear}
              key={barChartKey}
              style={{
                width: '8vw',
                height: '2vw',
              }}
              onChange={handleSelectedYear}
              options={yearOptions}
            />&nbsp;&nbsp;
            {index_num === 'B' ? (
              <Link to='/sysManage' style={linkStyle}>数据管理</Link>)
              :
              <Link to='/' style={linkStyle}>A级指标</Link>
            }


          </div>
          {/* left */}
          <div style={leftStyle}>

            {index_num === "B" && (
              <div key='left1' style={left1Style}>
                <>
                  {renderCustomComponent("B1", "B1 执行计划", "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='B1' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B1" && (
              <div key='left1' style={left1Style}>
                <>
                  {renderCustomComponent("%C11", "C11 "+Conf.primary_field[0][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C11' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B2" && (
              <div key='left1' style={left1Style}>
                <>
                  {renderCustomComponent("%C21", "C21 "+Conf.primary_field[1][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C21' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B3" && (
              <div key='left1' style={left1Style}>
                <>
                  {renderCustomComponent("%C31", "C31 "+Conf.primary_field[2][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C31' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B4" && (
              <div key='left1' style={left1Style}>
                <>
                  {renderCustomComponent("%C41", "C41 "+Conf.primary_field[3][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C41' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B5" && (
              <div key='left1' style={left1Style}>
                <>
                  {renderCustomComponent("%C51", "C51 "+Conf.primary_field[4][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C51' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B6" && (
              <div key='left1' style={left1Style}>
                <>
                  {renderCustomComponent("%C61", "C61 "+Conf.primary_field[5][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C61' />}
                  </div>
                </>
              </div>
            )}




            {index_num === "B" && (
              <div key='left2' style={left1Style}>

                <>
                  {renderCustomComponent("B2", "B2 设备效率", "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='B2' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B2" && (
              <div key='left2' style={left1Style}>

                <>
                  {renderCustomComponent("%C22", "C22 "+Conf.primary_field[6][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C22' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B3" && (
              <div key='left2' style={left1Style}>

                <>
                  {renderCustomComponent("%C32", "C32 "+Conf.primary_field[7][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C32' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B4" && (
              <div key='left2' style={left1Style}>

                <>
                  {renderCustomComponent("%C42", "C42 "+Conf.primary_field[8][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C42' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B5" && (
              <div key='left2' style={left1Style}>

                <>
                  {renderCustomComponent("%C52", "C52 "+Conf.primary_field[9][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C52' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B6" && (
              <div key='left2' style={left1Style}>

                <>
                  {renderCustomComponent("%C62", "C62 "+Conf.primary_field[10][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C62' />}
                  </div>
                </>
              </div>
            )}




            {index_num === "B" && (
              <div key='left3' style={left1Style}>

                <>
                  {renderCustomComponent("B3", "B3 生产耗能", "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='B3' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B3" && (
              <div key='left3' style={left1Style}>

                <>
                  {renderCustomComponent("%C33", "C33 "+Conf.primary_field[12][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C33' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B5" && (
              <div key='left3' style={left1Style}>

                <>
                  {renderCustomComponent("%C53", "C53 "+Conf.primary_field[13][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C53' />}
                  </div>
                </>
              </div>
            )}




          </div>
          {/* middle */}
          <div style={middleStyle}>
            {index_num === "B" && (
              <div key='middle1' style={middle1Style}>
                {renderCustomComponent("none", "综合效能分析")}
                {selectedYear && <RadarChartComponent key={barChartKey} year={selectedYear!} name='综合效能分析' type='A.comp' />}
              </div>
            )}
            {index_num === "B1" && (
              <div key='middle1' style={middle1Style}>
                {renderCustomComponent("none", Conf.B_field[0][1])}
                {selectedYear && <RadarChartComponent key={barChartKey} year={selectedYear!} name='计划执行分析' type='B1.comp' />}
              </div>
            )}
            {index_num === "B2" && (
              <div key='middle1' style={middle1Style}>
                {renderCustomComponent("none", Conf.B_field[1][1])}
                {selectedYear && <RadarChartComponent key={barChartKey} year={selectedYear!} name='设备频率分析' type='B2.comp' />}
              </div>
            )}
            {index_num === "B3" && (
              <div key='middle1' style={middle1Style}>
                {renderCustomComponent("none", Conf.B_field[2][1])}
                {selectedYear && <RadarChartComponent key={barChartKey} year={selectedYear!} name='生产物耗分析' type='B3.comp' />}
              </div>
            )}
            {index_num === "B4" && (
              <div key='middle1' style={middle1Style}>
                {renderCustomComponent("none", Conf.B_field[3][1])}
                {selectedYear && <RadarChartComponent key={barChartKey} year={selectedYear!} name='制丝工艺质量过程控制分析' type='B4.comp' />}
              </div>
            )}
            {index_num === "B5" && (
              <div key='middle1' style={middle1Style}>
                {renderCustomComponent("none", Conf.B_field[4][1])}
                {selectedYear && <RadarChartComponent key={barChartKey} year={selectedYear!} name='卷接包工艺质量过程控制分析' type='B5.comp' />}
              </div>
            )}
            {index_num === "B6" && (
              <div key='middle1' style={middle1Style}>
                {renderCustomComponent("none", Conf.B_field[5][1])}
                {selectedYear && <RadarChartComponent key={barChartKey} year={selectedYear!} name='节能减排分析' type='B6.comp' />}
              </div>
            )}




            {index_num === "B" && (
              <div key='middle2' style={middle1Style}>
                <>
                  {renderCustomComponent("A", "综合效能", "详情")}
                  {selectedYear && <BarChartGRComponent key={barChartKey} year={selectedYear!} type='A' />}
                </>
              </div>
            )}
            {index_num === "B1" && (
              <div key='middle2' style={middle1Style}>
                <>
                  {renderCustomComponent("B1", "B1 计划执行", "详情")}
                  {selectedYear && <BarChartGRComponent key={barChartKey} year={selectedYear!} type='B1' />}
                </>
              </div>)}
            {index_num === "B2" && (
              <div key='middle2' style={middle1Style}>
                <>
                  {renderCustomComponent("B2", "B2 设备效率", "详情")}
                  {selectedYear && <BarChartGRComponent key={barChartKey} year={selectedYear!} type='B2' />}
                </>
              </div>)}
            {index_num === "B3" && (
              <div key='middle2' style={middle1Style}>
                <>
                  {renderCustomComponent("B3", "B3 生产物耗", "详情")}
                  {selectedYear && <BarChartGRComponent key={barChartKey} year={selectedYear!} type='B3' />}
                </>
              </div>)}
            {index_num === "B4" && (
              <div key='middle2' style={middle1Style}>
                <>
                  {renderCustomComponent("B4", "B4 制丝工艺质量过程控制", "详情")}
                  {selectedYear && <BarChartGRComponent key={barChartKey} year={selectedYear!} type='B4' />}
                </>
              </div>)}
            {index_num === "B5" && (
              <div key='middle2' style={middle1Style}>
                <>
                  {renderCustomComponent("B5", "B5 卷接包工艺质量过程控制分析", "详情")}
                  {selectedYear && <BarChartGRComponent key={barChartKey} year={selectedYear!} type='B5' />}
                </>
              </div>)}
            {index_num === "B6" && (
              <div key='middle2' style={middle1Style}>
                <>
                  {renderCustomComponent("B6", "B6 节能减排", "详情")}
                  {selectedYear && <BarChartGRComponent key={barChartKey} year={selectedYear!} type='B6' />}
                </>
              </div>)}

          </div>


          {/* right */}
          <div style={rightStyle}>
            {index_num === "B" && (
              <div key='right1' style={right1Style}>

                <>
                  {renderCustomComponent("B4", "B4 制丝工艺质量过程控制", "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='B4' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B2" && (
              <div key='right1' style={right1Style}>

                <>
                  {renderCustomComponent("%C23", "C23 "+Conf.primary_field[14][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C23' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B3" && (
              <div key='right1' style={right1Style}>

                <>
                  {renderCustomComponent("%C34", "C34 "+Conf.primary_field[15][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C34' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B4" && (
              <div key='right1' style={right1Style}>

                <>
                  {renderCustomComponent("%C43", "C43 "+Conf.primary_field[16][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C43' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B5" && (
              <div key='right1' style={right1Style}>

                <>
                  {renderCustomComponent("%C54", "C54 "+Conf.primary_field[17][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C54' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B6" && (
              <div key='right1' style={right1Style}>

                <>
                  {renderCustomComponent("%C63", "C63 "+Conf.primary_field[18][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C63' />}
                  </div>
                </>
              </div>
            )}


            {index_num === "B" && (
              <div key='right2' style={right1Style}>

                <>
                  {renderCustomComponent("B5", "B5 卷接包工艺质量过程控制", "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='B5' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B2" && (
              <div key='right2' style={right1Style}>

                <>
                  {renderCustomComponent("%C24", "C24 "+Conf.primary_field[19][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C24' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B3" && (
              <div key='right2' style={right1Style}>

                <>
                  {renderCustomComponent("%C35", "C35 "+Conf.primary_field[20][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C35' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B4" && (
              <div key='right2' style={right1Style}>

                <>
                  {renderCustomComponent("%C44", "C44 "+Conf.primary_field[21][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C44' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B5" && (
              <div key='right2' style={right1Style}>

                <>
                  {renderCustomComponent("%C55", "C55 "+Conf.primary_field[22][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C55' />}
                  </div>
                </>
              </div>
            )}




            {index_num === "B" && (
              <div key='right3' style={right1Style}>

                <>
                  {renderCustomComponent("B6", "B6 "+Conf.primary_field[21][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='B6' />}
                  </div>
                </>
              </div>
            )}
            {index_num === "B3" && (
              <div key='right3' style={right1Style}>

                <>
                  {renderCustomComponent("%C36", "C36 "+Conf.primary_field[22][1], "详情")}
                  <div style={{ marginLeft: '0.5vw', width: '100%', height: '100%', alignItems: 'center' }}>
                    {selectedYear && <BarChartComponent key={barChartKey} year={selectedYear!} type='%C36' />}
                  </div>
                </>
              </div>
            )}
          </div>



        </Content>
      </Layout>
    </Flex>
  );
}

export default Ui;