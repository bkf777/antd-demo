import React, { useEffect, useState } from "react"
import type { RadioChangeEvent, TableProps } from "antd"
import {
    Button,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    notification,
} from "antd"
import axios from "../myAxios"
import {
    CheckCircleOutlined,
    StopOutlined,
    RedoOutlined,
} from "@ant-design/icons"

import styled from "styled-components"
import MySearch from "./search"
import Item from "antd/es/list/Item"

interface Item {
    key: string
    name: string
    age: number
    address: string
}

const originData: Item[] = []
for (let i = 0; i < 100; i++) {
    originData.push({
        key: i.toString(),
        name: `Edward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    })
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean
    dataIndex: string
    title: any
    inputType: "number" | "text"
    record: Item
    index: number
    children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    )
}
const MyTableStyle = styled.div``
const MyTable: React.FC = () => {
    const [form] = Form.useForm()
    const [type, setType] = useState("info")
    const [originData, setOriginData] = useState<any>([])
    const getData = async () => {
        await axios
            .post("/service/page", {
                currentPage: 1,
                pageSize: 10,
            })
            .then(res => {
                setData(res.data)
                setOriginData(res.data)
            })
    }
    const [option,setOption] = useState([])
    const [data, setData] = useState(originData)
    const [editingKey, setEditingKey] = useState("")

    const isEditing = (record: Item) => record.key === editingKey

    const getOption = async () => {
        const data = await axios.get("/service/getRouterStrategy")
        const option = data.data.map((item:any)=>({label:item,value:item}))
        setOption(option)
    }
    const cancel = () => {
        setEditingKey("")
    }
    useEffect(() => {
        getData()
        getOption()
    }, [])

    const getLog = async ({ type, applicationName }: any) => {
        const data = await axios.post("/log/" + type, {
            applicationName,
        })
        return data
    }
    const [msg, setMsg] = useState("")
    useEffect(() => {
        form.setFieldsValue({ msg })
    }, [msg])

    const columns = [
        {
            title: "应用名",
            dataIndex: "applicationName",
            width: "25%",
            key: "applicationName",
            editable: true,
            render: (value: any) => {
                if (!value) return <a>-</a>
                return <a>{value}</a>
            },
            // filters:data.map(item=>({text:item.name,value:item.name})),
            // onFilter: (value:any, record:any) => record.name.includes(value as string)
        },
        {
            title: "组名",
            dataIndex: "group",
            key: "group",
            editable: true,
            render: (value: any) => {
                if (!value) return <a>-</a>
                return <a>{value}</a>
            },
        },
        {
            title: "ip地址",
            dataIndex: "ip",
            key: "ip",
            editable: true,
            render: (value: any) => {
                if (!value) return <a>-</a>
                return <a>{value}</a>
            },
        },
        {
            title: "端口号",
            key: "port",
            dataIndex: "port",
            render: (value: any) => {
                if (!value) return <a>-</a>
                return <a>{value}</a>
            },
        },
        {
            title: "状态",
            key: "status",
            dataIndex: "status",
            render: (value: any) => {
                if (!!value) {
                    return (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            在线
                        </Tag>
                    )
                } else {
                    return (
                        <Tag color="error" icon={<StopOutlined />}>
                            离线
                        </Tag>
                    )
                }
            },
        },
        {
            title: "版本号",
            key: "version",
            dataIndex: "version",
            render: (value: any) => {
                if (!value) return <a>-</a>
                return <a>{value}</a>
            },
        },{
            title:"负载均衡",
            key:"routerStrategy",
            dataIndex:"routerStrategy",
            editable:true,
            render:(value:any,record:any)=>{
                return  (editingKey===record.applicationName&&record.status)? <Select style={{width:"100%"}} options={option}  onChange={(value1)=>{
                    console.log(value)
                    axios.post("/service/updateRouterStrategy",{
                        applicationName:record.applicationName,
                        oldRouterStrategy:value,
                        newRouterStrategy:value1,
                    }).then((res:any)=>{
                        if(res.code===0){
                            notification.success({
                                message:"修改成功"
                            })
                            getData()
                        }else{
                            notification.error({
                                message:"修改失败"
                            })
                        }
                        setEditingKey("")
                    })
                }} />:<a onClick={()=>{
                    console.log(record.applicationName)
                    setEditingKey(record.applicationName)
                }}>{value}</a>
                
            }
        },
        {
            title: "操作",
            key: "action",
            render: (_: any, record: any) => {
                return (
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                getLog({
                                    type: "info",
                                    applicationName: record.applicationName,
                                }).then((res: any) => {
                                    setMsg(res.msg)
                                    Modal.info({
                                        title: "日志查看",
                                        content: (
                                            <Space
                                                direction="vertical"
                                                style={{ width: "100%" }}
                                            >
                                                <Flex justify="space-between">
                                                    <Radio.Group
                                                        defaultValue="info"
                                                        buttonStyle="solid"
                                                        onChange={(
                                                            value: RadioChangeEvent
                                                        ) => {
                                                            const type =
                                                                value.target
                                                                    .value
                                                            setType(type)
                                                            setTimeout(() => {
                                                                getLog({
                                                                    type,
                                                                    applicationName:
                                                                        record.applicationName,
                                                                }).then(
                                                                    (res: any) => {
                                                                        setMsg(
                                                                            res.msg
                                                                        )
                                                                    }
                                                                )
                                                            }, 100)
                                                        }}
                                                    >
                                                        <Radio.Button
                                                            value={"info"}
                                                        >
                                                            info
                                                        </Radio.Button>
                                                        <Radio.Button
                                                            value={"error"}
                                                        >
                                                            error
                                                        </Radio.Button>
                                                        <Radio.Button
                                                            value={"warn"}
                                                        >
                                                            warn
                                                        </Radio.Button>
                                                        <Radio.Button
                                                            value={"debug"}
                                                        >
                                                            debug
                                                        </Radio.Button>
                                                    </Radio.Group>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => {
                                                            getLog({
                                                                type,
                                                                applicationName:record.applicationName,
                                                            })
                                                        }}
                                                    >
                                                        刷新
                                                    </Button>
                                                </Flex>
                                                <Form form={form}>
                                                    <Form.Item name={"msg"}>
                                                        <Input.TextArea
                                                            rows={25}
                                                        />
                                                    </Form.Item>
                                                </Form>
                                            </Space>
                                        ),
                                        closable: true,
                                        width: 1500,
                                    })
                                })
                            }}
                        >
                            日志查看
                        </Button>
                    </Space>
                )
            },
        },
    ]

    const mergedColumns: TableProps["columns"] = columns.map(col => {
        if (!col.editable) {
            return col
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === "age" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        }
    })

    return (
        <MyTableStyle>
            <Form form={form} component={false}>
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Flex>
                        <Form.Item
                            label="应用名搜索"
                            style={{ lineHeight: "64px" }}
                        >
                            <MySearch
                                onSearch={(value: any) => {
                                    const newData = data.filter((item:any) =>{
                                        (item as any).applicationName.includes(
                                            value
                                        )}
                                    )
                                    if (!value) {
                                        setData(originData)
                                        return
                                    }else{
                                    setData(newData)
                                    }
                                }}
                            />
                        </Form.Item>
                    </Flex>
                    <Table
                        key={1}
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        title={() => (
                            <Flex
                                style={{ width: "100%" }}
                                justify="space-between"
                            >
                                <Typography.Title level={4}>
                                    应用列表
                                </Typography.Title>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        getData().then(() => {
                                            notification.success({
                                                message: "刷新成功",
                                            })
                                        })
                                    }}
                                >
                                    <RedoOutlined />
                                </Button>
                            </Flex>
                        )}
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                    />
                </Space>
            </Form>
        </MyTableStyle>
    )
}

export default MyTable
