import { useState, Fragment } from 'react';
import { Form, Select } from "antd"
import './App.css'
import { DXFormFilter, DXSelect } from './entry';


function App() {
  const [form] = Form.useForm();
  const formItemList = [
    {
      position: "tab",
      key: "aa",
      placeholder: "今天"
    },
    {
      position: "tab",
      key: "aad",
      placeholder: "明天"
    },
    {
      position: "show",
      placeholder: "姓名",
      type: "input",
      key: "username",
      initialValue: "duxin",
      // rules: [{ required: true,message: '姓名为必填项' }],
    },
    {
      position: "show",
      placeholder: "数量",
      type: "input",
      key: "number",
    },
    {
      position: "hidden",
      placeholder: "年龄",
      type: "input",
      key: "age",
      initialValue: "90",

      // rules: [{ required: true, message: '年龄为必填项'}],
    },
    {
      type: "datePicker",
      position: "show",
      placeholder: "日期",
      key: "date",
      props: {
        width: "300px"
      }
    },
    {
      type: "rangePicker",
      position: "hidden",
      key: "rangedates",
      placeholder: "时间段",
    },
    {
      position: "hidden",
      placeholder: "select",
      key: "rrr",
      type: 'component',
      component: (<Select>
        <Select.Option value={97}>97</Select.Option>
        <Select.Option value={98}>98</Select.Option>
      </Select>)
    }
  ]
  const handleFinish = () => {
    console.log("表单", form)
    form.validateFields().then(values => {
      console.log("表单字段", values)
    }).catch(err => {
      console.log("err：", err)
    })
  }
  const defaultConfig = {
    options: [
      { itemKey: "123", itemValue: "test" },
      { itemKey: "124", itemValue: "test4" },
      { itemKey: "12", itemValue: "test43" },
      { itemKey: "122", itemValue: "test23" }
    ],
    styles: {
      width: "100px"
    },
    otherProps: {
      allowClear: true,
      onChange: (value: string, option: any,) => {
        console.log("value", value, option)
      }
    }
  }
  return <div>
    <DXFormFilter
      formItemList={formItemList}
      form={form} handleFinish={() => handleFinish()} />
    <DXSelect config={defaultConfig} defaultValue="12" filterProps={["123","12"]}/>
  </div>
}

export default App
