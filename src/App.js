import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select, Table, Upload} from "antd";

const { Option } = Select;

const { TextArea } = Input;

const dataSource = [
  {
    key: '1',
    index: 1,
    name: 'Mike',
    phone: '932468795',
    lang: 'ru',
  },
  {
    key: '2',
    index: 2,
    name: 'John',
    phone: '902468795',
    lang: 'uz',
  }
];

function App() {
  const [fileUploadForm] = Form.useForm();
  const [smsForm] = Form.useForm();
  const [lang, setLang] = useState('all');

  const handleChangeLang = (value) => setLang(value);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Язык',
      dataIndex: 'lang',
      key: 'lang',
    },
  ];

  const [filtered, setFiltered] = useState(dataSource);
  useEffect(() => {
    setFiltered(
      lang === 'all'
        ? [...dataSource]
        : dataSource.filter(item => item.lang === lang)
    );
  }, [lang]);


  const handleFinishFU = (values) => {
    console.log('Success:', values);
  };

  const handleFailFU = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleFinishSmsFrom = (values) => {
    const payload = {
      text: values.sms,
      contacts: filtered.map(item => item.phone)
    };
    console.log(payload);
    reset();
  };

  const handleFailSmsForm = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const reset = () => {
    smsForm.resetFields();
    fileUploadForm.resetFields();
    setFiltered([]);
    setLang('all');
  };

  return (
    <div className="app">
      <div className="row">

        <div className="col">
          <div className="file-upload">
            <Form
              form={fileUploadForm}
              name="fileupload"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={handleFinishFU}
              onFinishFailed={handleFailFU}
            >
              <Upload
                maxCount={1}
                accept={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
              >
                <Button>Загрузить файл(excel)</Button>
              </Upload>
            </Form>
          </div>

          <div className="customer-table m-t-30">
            <div className="m-t-20 m-b-20">
              <Select defaultValue="all" style={{width: 120}} onChange={handleChangeLang}>
                <Option value="all">Все</Option>
                <Option value="ru">Ру</Option>
                <Option value="uz">Уз</Option>
              </Select>
            </div>
            <div className="m-t-20 m-b-20">
              Количество элементов: <b>{filtered.length}</b>
            </div>
            <div className="overflow">
              <Table
                bordered={true}
                dataSource={filtered}
                columns={columns}
                pagination={false}
              />
            </div>
          </div>
        </div>

        <div className="col">
          <div className="sms-form">
            <h3 className="m-b-20">Текст SMS рассылки:</h3>
            <Form
              form={smsForm}
              name="smsform"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={handleFinishSmsFrom}
              onFinishFailed={handleFailSmsForm}
            >
              <Form.Item name="sms">
                <TextArea rows={4} showCount={true} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Отправить</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
