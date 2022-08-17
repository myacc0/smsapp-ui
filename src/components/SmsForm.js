import React from "react";
import {Button, Form, Input} from "antd";

const { TextArea } = Input;

export default function SmsForm({ list }) {

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="sms-form">
      <h3 className="m-b-20">Текст SMS рассылки:</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item>
          <TextArea rows={4} showCount={true} />
        </Form.Item>
        <Form.Item>
          <Button>Отправить</Button>
        </Form.Item>
      </Form>
    </div>
  )
}