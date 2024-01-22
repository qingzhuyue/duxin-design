import React from "react";
import { Select } from "antd";
import lodash from "lodash"

interface optionItem {
    itemKey?: string,
    itemValue?: string
}
interface ConfigProps {
    options: optionItem[],// 下拉框选项
    styles?: object, // 宽度
    otherProps?: object, // 其他属性
}
interface Props {
    config: ConfigProps,
    defaultValue?: any, // 默认值，
    type?: string, // 类型：text
    filterProps?: string[], // 过滤数据
}
const DXSelect: React.FC<Props> = ({ config, defaultValue, type, filterProps }) => {
    const { styles = { width: "200px" }, options, otherProps } = config;

    // 只渲染过滤的字典
    if (filterProps) {
        let newOptions = options.filter((item: any) => filterProps.includes(item.itemKey))
        return <Select style={styles} {...otherProps}>
            {
                newOptions.map((item: any) => <Select.Option key={item.itemKey} value={item.itemKey}>{item.itemValue}</Select.Option>)
            }
        </Select>
    }

    // 反显字典
    if (type) {
        const newOptions = lodash.find(options, { 'itemKey': defaultValue, });
        return newOptions?.itemValue
    }

    // 默认渲染的select组件
    return <Select defaultValue={defaultValue} style={styles} {...otherProps}>
        {
            options.map((item: any) => <Select.Option key={item.itemKey} value={item.itemKey}>{item.itemValue}</Select.Option>)
        }
    </Select>
}
export default DXSelect;