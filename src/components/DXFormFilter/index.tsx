import React, { useState, ReactNode } from "react";
import { Button, Col, DatePicker, Form, Input, Row, Tabs, Checkbox } from 'antd';
import {
  DoubleRightOutlined
} from '@ant-design/icons';
import "./index.scss";
import moment from 'moment';

interface ItemProps {
  placeholder: string,        // 提示文字
  key: string,       // 状态, 获取字段key值
  position: string,   // 状态文本 tab 关键状态筛选信息 show 直接展示的筛选条件 hidden 隐藏的筛选条件
  type?: string,  // 表单元素 input dictSelect datePicker ext
  dictkey?: string,// 数据字典值
  width?: number,
  span?: number,
  rules?: any[],
  decoratorProps?: any,
  initialValue?: string
}

interface Props {
  formItemList: ItemProps[]; //筛选条件列表
  extFormItemList?: any[]; //表单扩展元素
  hideButton?: Boolean;
  extAction?: ReactNode;
  form: any; // 表单
  handleFinish: Function,// 提交回调函数
}

const { TabPane } = Tabs;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
// 横向表单筛选
export default function FormFilter(props: Props) {
  const { extFormItemList = [], hideButton, extAction, formItemList, form, handleFinish } = props;
  // 收缩、展开
  const [toggle, setToggle] = useState(false);
  // tab选项
  const tabsList = formItemList.filter(item => item.position === 'tab');
  // 默认显示筛选条件字段
  const showList = formItemList.filter(item => item.position === 'show');
  const hiddenList = formItemList.filter(item => item.position === 'hidden');
  const callback = () => { }
  const levelSearch = () => { setToggle(!toggle) }
  const handleQueryFormKeyDown = () => { }
  const switchItemType = (item: any) => {
    item.props = item.props || {};
    switch (item.type) {
      // case 'dictSelect':
      //   return (
      //     <YRDict.Select
      //       allowClear
      //       placeholder={placeholderWithoutPrefix ? item.placeholder : `请选择${item.placeholder}`}
      //       style={{ width: '100%' }}
      //       dictkey={item.dictkey}
      //       mode={item.mode}
      //       filterkeys={item.filterkeys}
      //       onChange={item.onChange}
      //       width={item.width}
      //       showSearch
      //       optionFilterProp="children"
      //       filterOption={(input, option) =>
      //         option.props.children[1] && option.props.children[1].includes(input && input.trim())
      //       }
      //       onKeyDown={handleQueryFormKeyDown}
      //       {...item.props}
      //     />
      //   );
      case 'input':
        return (
          <Input
            onBlur={item.onBlur}
            onChange={item.onChange}
            placeholder={item?.placeholder && `请输入${item.placeholder}`}
            width={item?.width}
            allowClear
            onKeyDown={handleQueryFormKeyDown}
            {...item.props}
          />
        );
      // case 'pcaSelect':
      //   return (
      //     <YRPcaSelect
      //       onChange={item.onChange}
      //       level="3"
      //       placeholder={placeholderWithoutPrefix ? item.placeholder : `请输入${item.placeholder}`}
      //       width={item.width}
      //       onKeyDown={handleQueryFormKeyDown}
      //       {...item.props}
      //     />
      //   );
      case 'datePicker':
        return (
          <DatePicker
            onChange={item.onChange}
            allowClear
            placeholder={item?.placeholder && `请选择${item.placeholder}`}
            width={item.width}
            onKeyDown={handleQueryFormKeyDown}
            {...item.props}
          />
        );
      case 'rangePicker':
        return (
          <DatePicker.RangePicker
            allowClear
            placeholder={
              item.rangePickerPlaceholder ? item.rangePickerPlaceholder : ['开始日期', '结束日期']
            }
            // dateRender={{
            //   今日: [moment().startOf('day'), moment().endOf('day')],
            //   本周: [moment().startOf('week'), moment().endOf('week')],
            //   本月: [moment().startOf('month'), moment().endOf('month')],
            //   清空: [],
            // }}
            width={item.width}
            showTime={!!item.showTime}
            onKeyDown={handleQueryFormKeyDown}
            {...item.props}
          />
        );

      case 'component':
        return item.component;
      default:
        return (
          <Input
            onChange={item.onChange}
            placeholder={item.placeholder && `请输入${item.placeholder}`}
            onKeyDown={handleQueryFormKeyDown}
            {...item.props}
          />
        );
    }
  }
  const onFinish = (values: any) => {
    handleFinish()
  };

  const onReset = () => {
    form.resetFields();
  };
  return <div className="toolbarSearch">
    <Form form={form} onFinish={onFinish}>
      <Row justify="space-between" align="middle">
        <Col>
          <Row
            align="middle"
            justify="start"
            gutter={12}
            className="formItemBottom"
          >
            {tabsList && tabsList.length > 0 ? (
              <Col style={{ fontSize: 14 }}>
                <Tabs
                  defaultActiveKey={tabsList[0].key}
                  className="tabsCover"
                  onChange={callback}
                >
                  {tabsList.map(item => (
                    <TabPane tab={item.placeholder} key={item.key} />
                  ))}
                </Tabs>
              </Col>
            ) : (
              ''
            )}

            {showList && showList.length > 0
              ? showList.map(item => {
                return (
                  <Col key={item.key} style={{ width: item.width || 170 }}>
                    <FormItem name={item.key} initialValue={item.initialValue} rules={item.rules && [...item.rules]}>
                      {switchItemType(item)}
                    </FormItem>
                  </Col>
                );
              })
              : null}
            {extFormItemList}
            {hiddenList && hiddenList.length > 0 ? (
              <Col>
                <div
                  onClick={levelSearch}
                  className={`search ${toggle ? 'btn-edit' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {toggle ? <DoubleRightOutlined style={{ fontSize: 12, marginRight: 4, transform: "rotate(-90deg)" }} /> : <DoubleRightOutlined style={{ fontSize: 12, marginRight: 4, transform: "rotate(90deg)" }} />}
                  {toggle ? <span>收起</span> : <span>展开</span>}
                </div>
              </Col>
            ) : (
              ''
            )}
            {hideButton ? (
              ''
            ) : (
              <Col>
                <Button type="primary" htmlType="submit" style={{ marginRight: 12 }} >
                  查询
                </Button>
                <Button htmlType="button" onClick={onReset}>重置</Button>
              </Col>
            )}
          </Row>
        </Col>
        <Col className="extAction">{extAction || ''}</Col>
      </Row>

      <div
        style={{ background: '#f6f6f6' }}
        className={`${toggle ? "levelSearch" : "hide"}`}
      >
        <Row>
          {hiddenList && hiddenList.length > 0
            ? hiddenList.map(item => {
              return (<Col key={item.key} span={item.span || 8}>
                <FormItem name={item.key} label={item.placeholder} rules={item.rules && [...item.rules]} {...item.decoratorProps} {...formItemLayout}>
                  {switchItemType(item)}
                </FormItem>
              </Col>
              );
            })
            : ''}
        </Row>
      </div>
    </Form>
  </div>
}
