"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Table, Input, message } from "antd";
import moment from "moment";

const { Search } = Input;

const CustomerEnquiry = () => {
  const session = useSession();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (session.data?.user?.accessToken) {
      fetchData();
    }
  }, [session.data?.user?.accessToken]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/enquiry", {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${session.data?.user?.accessToken}` // this doesnt work
          Authorization: session.data?.user?.accessToken,
        },
      });
      const data = await response.json();
      setData(data.info);
      if (response.status === 401) {
        message.error("Session expired. Please login again");
        setTimeout(() => {
          signOut();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150,
      align: "center",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      },
      showSorterTooltip: false,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "center",
      render: (text) => {
        return text.toUpperCase();
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      align: "center",
      render: (text) => {
        return text.toLowerCase();
      },
    },
    {
      title: "Phone number",
      dataIndex: "number",
      key: "number",
      width: 200,
      align: "center",
      render: (text) => {
        return text.toUpperCase();
      },
    },
    Table.EXPAND_COLUMN,
    // Table.SELECTION_COLUMN,
  ];

  const dataSource = data.map((item, index) => ({
    key: index + 1,
    date: moment(item.date).format("YYYY-MM-DD"),
    name: item.name,
    email: item.email,
    number: item.number,
    message: item.message,
  }));

  return (
    <section className="min-h-screen  bg-zinc-100">
      <div className="p-4 px-6 bg-white shadow">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Customer Enquiry
        </h1>
      </div>
      <div className="p-5 space-y-3">
        <h1 className="font-poppins text-sm">Search by Name :</h1>
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{
            width: 300,
          }}
        />
      </div>

      <div className="px-5">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={true}
          expandable={{
            expandedRowRender: (record) => <p>{record.message}</p>,
          }}
          scroll={{ y: 500 }}
          bordered
        />
      </div>
    </section>
  );
};

export default CustomerEnquiry;
