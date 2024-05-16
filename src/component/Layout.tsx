import React from "react"
import { Flex, Layout, Space } from "antd"

const { Header, Footer, Sider, Content } = Layout

const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: "100%",
    paddingInline: 48,
    lineHeight: "64px",
    // backgroundColor: "#4096ff",
}

const contentStyle: React.CSSProperties = {
    textAlign: "center",
    minHeight: "calc(100vh - 120px)",
    lineHeight: "120px",
    color: "#fff",
    // backgroundColor: "#0958d9",
}

const siderStyle: React.CSSProperties = {
    textAlign: "center",
    lineHeight: "120px",
    color: "#fff",
    backgroundColor: "rgba(245, 245, 245, 1)",
}

const footerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#4096ff",
}

const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
}

const MyLayout: React.FC = () => (
    <Layout style={layoutStyle}>
        <Header style={headerStyle}>RPC-Framework-Dashboard</Header>
        <Layout>
            <Sider width="15%" style={siderStyle}>
            </Sider>
            <Content style={contentStyle}>
                <Space direction="vertical" style={{width:"100%"}}>
                    <Tab1/>
                </Space>
            </Content>
            <Sider width="15%" style={siderStyle}>
            </Sider>
        </Layout>
        <Footer style={footerStyle}></Footer>
    </Layout>
)

export default MyLayout




import Tab1 from "../views/tab/tabs/tab1"

