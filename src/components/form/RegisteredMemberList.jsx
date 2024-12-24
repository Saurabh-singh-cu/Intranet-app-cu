import React, { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import styles from "./AdminEventApproval.module.css";

const RegisteredMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchRegisteredList();
  }, []);

  const getRegId = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return (
      userData?.faculty_advisory_details?.reg_id ||
      userData?.secretary_details?.reg_id
    );
  };

  const fetchRegisteredList = async () => {
    setLoading(true);
    try {
      const reg_id = getRegId();
      const response = await axios.post(
        `http://172.17.2.247:8080/intranetapp/memberships/`,
        { reg_id: reg_id },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.access}`
          }
        }
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load members. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'member_name',
      key: 'member_name',
      sorter: (a, b) => a.member_name.localeCompare(b.member_name),
    },
    {
      title: 'UID',
      dataIndex: 'member_uid',
      key: 'member_uid',
    },
    {
      title: 'Email',
      dataIndex: 'member_email',
      key: 'member_email',
    },
    {
      title: 'Mobile',
      dataIndex: 'member_mobile',
      key: 'member_mobile',
    },
    {
      title: 'Department',
      dataIndex: 'dept_name',
      key: 'dept_name',
    },
    {
      title: 'Membership Code',
      dataIndex: 'membership_code',
      key: 'membership_code',
    },
    {
      title: 'Session',
      dataIndex: 'session_code',
      key: 'session_code',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
  ];

  const filteredMembers = members.filter(member =>
    Object.values(member).some(value =>
      value && value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDownloadExcel = () => {
    const dataToExport = filteredMembers.map(({ member_id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(wb, "registered_members.xlsx");
  };

  return (
    <div style={{ padding: "40px", marginTop: "40px" }} className={styles.adminEventApproval}>
      <h2 className={styles.pageTitle}>Registered Members</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Search members"
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredMembers}
        loading={loading}
        rowKey="member_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        className={styles.customTable}
      />
    </div>
  );
};

export default RegisteredMemberList;
