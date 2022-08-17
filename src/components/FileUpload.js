import React from "react";
import { Button, Form, Upload } from 'antd';

export default function FileUpload() {

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="file-upload">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Upload
          maxCount={1}
          accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
        >
          <Button>Загрузить файл(excel)</Button>
        </Upload>
      </Form>
    </div>
  )
}