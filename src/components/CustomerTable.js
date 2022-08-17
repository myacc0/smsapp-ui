import React, {useEffect, useState} from "react";
import { Table, Select } from "antd";

const { Option } = Select;

export default function CustomerTable({ list }) {
  const [lang, setLang] = useState('all');

  const handleChange = (value) => setLang(value);

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

  const [filtered, setFiltered] = useState(list);
  useEffect(() => {
    setFiltered(
      lang === 'all'
        ? [...list]
        : list.filter(item => item.lang === lang)
    );
  }, [lang]);

  return (
    <div className="customer-table m-t-30">
      <div className="m-t-20 m-b-20">
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={handleChange}
        >
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
  )
}