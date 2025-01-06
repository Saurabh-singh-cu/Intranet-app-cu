import React, { useState } from 'react';
import { Drawer, Form, Input, Button, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import './EventCard.css';

const EventCardEdit = ({ visible, onClose, member, onSubmit }) => {
  const [form] = Form.useForm();
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const validateUrl = (_, value) => {
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!value || pattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Invalid URL'));
  };

  const validateEmail = (_, value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || pattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Invalid email address'));
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key]);
      }
      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      const response = await axios.post('/api/user-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        onSubmit(values);
        Swal.fire({
          title: 'Success',
          text: 'User info updated successfully',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update user info',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error updating user info',
        icon: 'error',
      });
    }
  };

  return (
    <Drawer
      title={`Edit ${member.position}`}
      placement="right"
      onClose={onClose}
      visible={visible}
      width={500}
      className="edit-drawer"
    >
      <Form form={form} onFinish={handleSubmit} initialValues={member} layout="vertical">
        <Form.Item name="image" label="Image" rules={[{ required: true, message: 'Please upload an image!' }]}>
          <Upload.Dragger
            name="banner"
            className="banner-box"
            multiple={false}
            beforeUpload={(file) => {
              setBannerFile(file);
              setBannerPreview(URL.createObjectURL(file));
              return false;
            }}
            onChange={(info) => {
              const { status } = info.file;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                Swal.fire({
                  title: 'Success',
                  text: `${info.file.name} banner file ready for upload.`,
                  icon: 'success',
                });
              } else if (status === 'error') {
                Swal.fire({
                  title: 'Error',
                  text: `${info.file.name} banner file failed to prepare.`,
                  icon: 'error',
                });
              }
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to upload banner</p>
          </Upload.Dragger>
          {bannerPreview && (
            <div style={{ marginTop: '16px' }}>
              <img src={bannerPreview} alt="Preview" style={{ width: '30%' }} />
            </div>
          )}
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Position">
          <Input disabled />
        </Form.Item>
        <Form.Item name="facebook" label="Facebook" rules={[{ validator: validateUrl }]}>
          <Input />
        </Form.Item>
        <Form.Item name="instagram" label="Instagram" rules={[{ validator: validateUrl }]}>
          <Input />
        </Form.Item>
        <Form.Item name="linkedin" label="LinkedIn" rules={[{ validator: validateUrl }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gmail" label="Gmail" rules={[{ validator: validateEmail }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EventCardEdit;
