import React, {useEffect, useState, useRef} from "react";
import {Button, Form, Input, Select, Table, message} from "antd";

const { Option } = Select;
const { TextArea } = Input;

const columnsRecipients = [
  {
    title: '#',
    dataIndex: 'order',
    key: 'order',
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

function App() {
  const fileInput = useRef(null);
  const [smsForm] = Form.useForm();
  const [lang, setLang] = useState('all');
  const [loading, setLoading] = useState(false);
  const [notSent, setNotSent] = useState([]);

  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    setFiltered(
      lang === 'all'
        ? [...contacts]
        : contacts.filter(item => item.lang === lang)
    );
  }, [lang]);


  const handleFUSubmit = (e) => {
    e.preventDefault();
    if (fileInput.current.files.length === 0) {
      message.warning("Выберите EXCEL файл для загрузки!");
      return;
    }
    let formData = new FormData();
    formData.append("file", fileInput.current.files[0]);
    try {
      fetch("http://localhost:8080/api/upload", {
        method: 'POST',
        body: formData,
      })
      .then(res => res.json())
      .then(data => {
        let list = data.map(item => ({...item, key: item.order, lang: item.lang === 'empty' ? '' : item.lang}));
        setContacts(list);
        setFiltered(list);
      })
      .catch(error => {
        message.error(error);
      });
    } catch (error) {
      message.error('Ошибка:', error);
    }
  };

  const handleFinishSmsFrom = (values) => {
    if (!values.sms) {
      message.warning("Текст сообщения пуст!")
      return;
    }
    if (filtered.length === 0) {
      message.warning("Список рассылки пуст!");
      return;
    }

    setLoading(true);
    try {
      fetch("http://localhost:8080/api/sms-send", {
        method: 'POST',
        body: JSON.stringify({
          text: values.sms,
          recipients: filtered.map(item => item.phone)
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          message.success(data.text);
          setNotSent(data.notSent);
          reset();
        })
        .catch(error => {
          message.error(error);
          reset();
        });
    } catch (error) {
      message.error('Ошибка:', error);
      reset();
    }
  };

  const reset = () => {
    smsForm.resetFields();
    setLoading(false);
  };

  return (
    <div className={`app ${loading ? 'active' : ''}`}>
      <div className="row">

        <div className="col">
          <div className="file-upload">
            <form method="post" onSubmit={handleFUSubmit}>
              <input
                ref={fileInput}
                type="file"
                name="excel"
                accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
              />
              <Button type="primary" htmlType="submit">Загрузить файл</Button>
            </form>
          </div>

          <div className="customer-table m-t-30">
            <div className="m-t-20 m-b-20">
              <Select defaultValue="all" style={{width: 120}} onChange={setLang}>
                <Option value="all">Все</Option>
                <Option value="ru">Ру</Option>
                <Option value="uz">Уз</Option>
                <Option value="null">Не указано</Option>
              </Select>
            </div>
            <div className="m-t-20 m-b-20">
              Количество элементов: <b>{filtered.length}</b>
            </div>
            <div className="overflow">
              <Table
                bordered={true}
                dataSource={filtered}
                columns={columnsRecipients}
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
              onFinishFailed={(error) => console.log(error)}
            >
              <Form.Item name="sms">
                <TextArea rows={4} showCount={true} allowClear={true} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Отправить</Button>
              </Form.Item>
            </Form>
          </div>

          {notSent.length > 0 && (
            <div className="m-t-30 p-l-40">
              <h3>Не отправленные номера: (<b>{notSent.length}</b>)</h3>
              <ul>
                {
                  notSent.map((item, index) => (
                    <li key={`notsent${index}`}>#. {item}</li>
                  ))
                }
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
