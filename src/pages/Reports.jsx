import React from "react";
import { Table } from "antd";
import Header from "../components/Header";

const today = new Date();
const date = today.getDate();
const month = today.getMonth() + 1; // January is 0!
const year = today.getFullYear();

const todayDate = `${date}/${month}/${year}`;

const columns = [
  {
    title: "Serial.No",
    dataIndex: "SrlNo",
    key: "serialNo",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Service",
    dataIndex: "service",
    key: "service",
  },
  {
    title: "Income",
    dataIndex: "expense",
    key: "expense",
  },
 
];

const data = [
  {
    SrlNo: 1,
    date: todayDate,
    name: "John Brown",
    service: "New York No. 1 Lake Park",
    expense: "100 AED",
    remark: "Monthly subscription",
  },
  {
    SrlNo: 2,
    date: todayDate,
    name: "Jim Green",
    service: "London No. 1 Lake Park",
    expense: "150 AED",
    remark: "Annual maintenance",
  },
  {
    SrlNo: 3,
    date: todayDate,
    name: "Not Expandable",
    service: "Jiangsu No. 1 Lake Park",
    expense: "200 AED",
    remark: "One-time setup",
  },
  {
    SrlNo: 4,
    date: todayDate,
    name: "Joe Black",
    service: "Sydney No. 1 Lake Park",
    expense: "250 AED",
    remark: "Monthly subscription",
  },
  {
    SrlNo: 5,
    date: todayDate,
    name: "Joe Black",
    service: "Sydney No. 1 Lake Park",
    expense: "250 AED",
    remark: "Monthly subscription",
  },
];

const Reports = () => {
  return (
    <>
      <Header />
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default Reports;
