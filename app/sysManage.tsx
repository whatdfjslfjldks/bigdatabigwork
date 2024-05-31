'use client';
import React, { useState, useEffect,useRef } from 'react';
import { Layout, Flex, Select, Space, Button, Modal, DatePicker, Input, Table } from 'antd';
import type { DatePickerProps, TableProps } from 'antd';
import Model from './utils/model';
import * as Conf from "./conf/config";

// import docxtpl from './utils/docxtpl';

const { Header, Content } = Layout;

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  height: '100vh',
  maxWidth: '100vw',
  backgroundColor: '#FFFFFF',
};
const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000000',
  height: '5vw',
  paddingInline: '4vw',
  lineHeight: '5vw',
  backgroundColor: '#FFFFFF',
  fontSize: '3vw',
  fontWeight: 'bold',
};
const spaceStyle: React.CSSProperties = {
  width: '100vw',
  marginLeft: '4vw',
  height: '2vw',
  backgroundColor: '#FFFFFF',
};
const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '3vw',
  minHeight: '20vw',
  lineHeight: '20vw',
  color: '',
  backgroundColor: '#FFFFFF',
};
function SysManage() {
  const [open, setOpen] = useState(false);
  // const [open2, setOpen2] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState<{ current: number, pageSize: number, total: number }>({ current: 1, pageSize: 5, total: 0 });

  const [selectedNum, setSelectedNum] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [yearOptions, setYearOptions] = useState<{ value: number; label: string; }[]>([]);
  const [tipOpen, setTipOpen] = useState(false);
  const [index_num, setIdex_num] = useState('');
  const [year, setYear] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [data, setData] = useState<number>();
  const [deletingItemId, setDeletingItemId] = useState<number>();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTip, setDeleteTip] = useState(false);


  const [totalItems, setTotalItems] = useState<number>();

    const [excelFile, setExcelFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

  // const[year2,setYear2]=useState('');

  const options = [
    { value: 'C11', label: 'C11' },
    { value: 'C21', label: 'C21' },
    { value: 'C22', label: 'C22' },
    { value: 'C23', label: 'C23' },
    { value: 'C24', label: 'C24' },
    { value: 'C31', label: 'C31' },
    { value: 'C32', label: 'C32' },
    { value: 'C33', label: 'C33' },
    { value: 'C34', label: 'C34' },
    { value: 'C35', label: 'C35' },
    { value: 'C36', label: 'C36' },
    { value: 'C41', label: 'C41' },
    { value: 'C42', label: 'C42' },
    { value: 'C43', label: 'C43' },
    { value: 'C44', label: 'C44' },
    { value: 'C51', label: 'C51' },
    { value: 'C52', label: 'C52' },
    { value: 'C53', label: 'C53' },
    { value: 'C54', label: 'C54' },
    { value: 'C55', label: 'C55' },
    { value: 'C61', label: 'C61' },
    { value: 'C62', label: 'C62' },
    { value: 'C63', label: 'C63' },
  ]

  useEffect(() => {
    const yearOptions = Model.year.map((year) => ({
      value: year,
      label: `${year}`,
    }));

    setYearOptions(yearOptions);
  }, [Model.year]);

  const handleChange = (value: string) => {
    setIdex_num(value);
  };
  const handleSelectedNum = (value: string) => {
    setSelectedNum(value);
  }
  const handleSelectedYear = (value: string) => {
    setSelectedYear(value);
  }

  const handleAddClick = () => {
    setOpen(true);
  }

  // const handleGenerateClick=()=>{
  //   docxtpl.registTpl("test.docx");
  //   docxtpl.use("test.docx").make("test.docx", {head:"awa", body:"this is a test data"}, { });
  // }


  const handleOk = () => {
    Model.put(index_num, year!, month!, data!)
      .then((responseData) => {
        // 处理提交成功后的响应
        setOpen(false);
        setTipOpen(false);
        // console.log("Data submitted successfully:", responseData);
      })
      .catch((error) => {
        // 处理提交失败的情况
        setTipOpen(true);
        // console.error("Error submitting data:", error);
      });
  };


  const handleCancel = () => {
    setOpen(false);
  };

  // const handleGenerateClick=()=>{
  //   console.log('generate');
  //   setOpen2(true);
  // }
  // const handleOk2 = () => {
  //   console.log('ok2');
  //   setOpen2(false);
  // };

  // const handleCancel2 = () => {
  //   console.log('cancel2');
  //   setOpen2(false);
  // };
  const handelDeleteClick = (id: number) => {
    // console.log('delete' + id);
    setDeletingItemId(id);
    setDeleteModalVisible(true);
  }

  const onPickDate: DatePickerProps['onChange'] = (date, dateString:any) => {
    // console.log(date, dateString);
    const selectedDate = new Date(dateString);
    // 提取年份和月份
    const pickedYear = selectedDate.getFullYear();
    const pickedMonth = selectedDate.getMonth() + 1;

    setYear(pickedYear);
    setMonth(pickedMonth);

    // console.log('Year:', year);
    // console.log('Month:', month);
  };

  // const onPickYear = (date:any, dateString:any) => {
  //   console.log('选择的年份:'+dateString);
  //   setYear2(dateString);

  // };

  const monthCellRender = (value: any) => {
    const month = value.month() + 1;
    return (
      <div className="ant-picker-cell-inner">
        <p>{`${month}月`}</p>
      </div>
    );
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // console.log("data:" + value);
    setData(parseFloat(value));
  };

  interface DataType {
    key: React.Key,
    id: number,
    index_num: string,
    index_name: string,
    department: string,
    data_sources: string,
    cycle: string,
    type: string,
    measurement_unit: string,
    year: number,
    month: number,
    data: number,
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hidden: true, // 不在表格中显示,对信息进行更改时候用到
    },
    {
      title: '类型序号',
      dataIndex: 'indexNum',
      key: 'indexNum',
    },
    {
      title: '类型名称',
      dataIndex: 'indexName',
      key: 'indexName',
    },
    {
      title: '所属部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '数据来源',
      dataIndex: 'dataSources',
      key: 'dataSources',
    },
    {
      title: '时间单位',
      dataIndex: 'cycle',
      key: 'cycle',
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '计量单位',
      dataIndex: 'measurementUnit',
      key: 'measurementUnit',
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '数据',
      dataIndex: 'data',
      key: 'data',
    },
    {
      title: 'parentID',
      dataIndex: 'parentID',
      key: 'parentID',
      hidden: true, // 不在表格中显示,对信息进行更改时候用到
    },
    {
      title: '删除',
      key: 'delete',
      render: (record) => (
        <Space size="middle">
          <Button onClick={() => handelDeleteClick(record.id)} style={{ backgroundColor: '#f50', color: '#fff' }}>删除</Button>
        </Space>
      ),
    },
  ];

  const fetchData = async (pageSize: number) => {
    try {
      let filter = '';

      if (selectedNum && selectedYear) {
        filter = `index_num eq '${selectedNum}' AND year eq '${selectedYear}'`;
      } else if (selectedNum) {
        filter = `index_num eq '${selectedNum}'`;
      } else if (selectedYear) {
        filter = `year eq '${selectedYear}'`;
      }

      // console.log("selectedYear" + selectedYear);
      // console.log("dangqianyemian", pagination.current);
      const page = pagination.current - 1;//设置的从0开始，table表是从1，所以要减一
      const queryPattern = {
        page,
        size: pageSize,
        filter,
      };
      // console.log("filter", JSON.stringify(filter));
      // console.log("queryPattern", JSON.stringify(queryPattern));

      Model.query(queryPattern)
        .then((responseData) => {
          // 处理提交成功后的响应
          setOpen(false);

          // console.log(index_num, year, month, data);
          // console.log("Data submitted successfully:", responseData);
          const data = responseData.data;
          setTotalItems(Number(data.total));
          const list = data.list || [];

          const total = data.total || 0;


          setTableData(list);
          setPagination({ ...pagination, total: parseInt(total, 10) });
        })
        .catch((error) => {
          // 处理提交失败的情况 

          console.error("Error submitting data:", error);
        });
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData(pagination.pageSize);

    // console.log("current", pagination.current);
  }, [pagination.current, pagination.pageSize, selectedYear, selectedNum]);

  const handleTableChange = (e: any) => {
    setPagination({
      ...pagination,
      current: e,
    });

  };



  const handleDelete = () => {
    Model.del(deletingItemId!) //只要打开就一定有id，所以假言推理为真
      .then(response => {
        // console.log('Delete successful:', response);
        setDeleteModalVisible(false);
        setDeletingItemId(NaN);
        fetchData(pagination.pageSize);//刷新界面
      })
      .catch(error => {
        setDeleteTip(true);
        console.error('Delete failed:', error);
      });

  };

  const handleCancelDelete = () => {
    setDeletingItemId(NaN);
    setDeleteModalVisible(false);
  };
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 模拟点击 input 元素
    }
  };

    const handleExcelClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("choose excel");
    if (event.target.files && event.target.files.length > 0) {
      console.log(event.target.files[0]+" choose it");
      const selectedFile = event.target.files[0];
      setExcelFile(selectedFile);
      handleUpload();
    }
  };
//如何理解log导致内存泄漏，如何解决？
    const handleUpload = () => {
      console.log("123123");
    if (excelFile) {
      console.log(excelFile+" upload it");
      const formData = new FormData();
      formData.append('excelFile', excelFile);

      fetch(Conf.api_prifix+'/upload-excel', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        console.log(response);
        if (response.ok) {
          console.log('Excel file uploaded successfully');
          // 可以在这里处理上传成功后的逻辑
        } else {
          console.error('Failed to upload Excel file');
          // 可以在这里处理上传失败后的逻辑
        }
      })
      .catch(error => {
        console.error('Error while uploading Excel file:', error);
      });
    }
  };



  return (
    <Flex gap="middle" wrap="wrap">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>用户信息表</Header>


        <Space wrap style={spaceStyle}>
          <Select
            defaultValue={undefined}
            placeholder='类型序号'
            style={{ width: 120 }}
            onChange={handleSelectedNum}
            options={options}
          />
          <Select
            defaultValue={undefined}
            placeholder='年份'
            style={{ width: 120 }}
            onChange={handleSelectedYear}
            options={yearOptions}
          />


          <Button onClick={handleAddClick} style={{ backgroundColor: '#1890ff', color: '#fff' }}>新增</Button>
          {/* <Button onClick={handleGenerateClick} style={{ backgroundColor: '#1890ff', color: '#fff' }}>docx测试</Button> */}
          {/* <input  type="file" accept=".xlsx, .xls" onChange={handleExcelClick}/>
          <Button style={{ backgroundColor: '#1890ff', color: '#fff' }}>
            上传(.xlsx, .xls)
            </Button> */}

<input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        style={{ display: 'none' }} // 隐藏 input 元素
        onChange={handleExcelClick}
      />
      <Button
        style={{ backgroundColor: '#1890ff', color: '#fff'}}
        onClick={handleUploadClick}
      >
        上传(.xlsx, .xls)
      </Button>
          <Modal
            title="用户信息"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="确认"
            cancelText="取消"
            okButtonProps={{ style: { backgroundColor: '#1890ff', color: '#fff' } }}
            cancelButtonProps={{ style: { backgroundColor: '#f50', color: '#fff' } }}
          >
            <div>类型序号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Select
                defaultValue={undefined}
                style={{ width: '20vw' }}
                placeholder='类型序号'
                onChange={handleChange}
                options={options}
              /></div>
            <div>日期&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <DatePicker onChange={onPickDate} style={{ width: '20vw' }} cellRender={monthCellRender} picker="month" placeholder='请选择日期' />
            </div>
            <div>数据&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Input
                placeholder="请输入数据"
                style={{ width: '20vw' }} // 设置宽度
                type="number" // 设置输入类型为文本
                value={data}
                onChange={handleInputChange}
              />
            </div>
            {tipOpen && <span style={{ fontWeight: 'bold', color: 'red' }}>请勿提交空数据或重复年月份数据!</span>}
          </Modal>
          <Modal
            title="确认删除"
            open={deleteModalVisible}
            onOk={handleDelete}
            onCancel={handleCancelDelete}
            okText="确认"
            cancelText="取消"
            okButtonProps={{ style: { backgroundColor: '#1890ff', color: '#fff' } }}
            cancelButtonProps={{ style: { backgroundColor: '#f50', color: '#fff' } }}
          >
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>确定要删除吗？</p>
            {deleteTip && <span style={{ fontWeight: 'bold', color: 'red' }}>请检查您的网络设置！</span>}
          </Modal>
          {/* <Modal
        title="生成数据年份"
        open={open2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        okText="确认"  
        cancelText="取消" 
        okButtonProps={{ style: { backgroundColor: '#1890ff', color: '#fff' } }}
        cancelButtonProps={{ style: { backgroundColor: '#f50', color: '#fff' } }}
      >
        <DatePicker onChange={onPickYear} style={{ width: '20vw' }} picker="year" placeholder='请选择年份' />
      </Modal> */}
        </Space>

        <Content style={contentStyle}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{
              // current: pagination.current,
              //pageSize 删掉可不可以？
              pageSize: 5,
              total: totalItems,
              onChange: (e) => handleTableChange(e),
              showSizeChanger: false, // 隐藏每页显示数量的下拉框
            }} />;
        </Content>
      </Layout>


    </Flex>
  );
}

export default SysManage;



// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';

// const ExcelUploader: React.FC = () => {
//   const [excelFile, setExcelFile] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       console.log(event.target.files[0]+" choose it");
//       const selectedFile = event.target.files[0];
//       setExcelFile(selectedFile);
//     }
//   };

//   const handleUpload = () => {
//     if (excelFile) {
//       console.log(excelFile+" upload it");
//       const formData = new FormData();
//       formData.append('excelFile', excelFile);

//       fetch('/api/upload-excel', {
//         method: 'POST',
//         body: formData,
//       })
//       .then(response => {
//         console.log(response);
//         if (response.ok) {
//           console.log('Excel file uploaded successfully');
//           // 可以在这里处理上传成功后的逻辑
//         } else {
//           console.error('Failed to upload Excel file');
//           // 可以在这里处理上传失败后的逻辑
//         }
//       })
//       .catch(error => {
//         console.error('Error while uploading Excel file:', error);
//       });
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={!excelFile}>
//         Upload
//       </button>
//     </div>
//   );
// };

// export default ExcelUploader;
