'use client';
import { blue } from '@ant-design/colors';
import { DownOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Dropdown, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { FC, Key, useRef, useState } from 'react';
import FiltrersTable from './filters';
import { TableParams } from './utils';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface IProps {
  data: any[];
  columns: CountTVColumnsType<any>[];
  loading: boolean;
  tableParams: TableParams;
  onChangeTableParams: (args: any) => void;
  onFilterChange: (filters: any) => void;
  expandable?: any;
  footer?: any;
}

const LoretaTable = ({
  data,
  columns,
  loading,
  tableParams = { pagination: { current: 1, pageSize: 15 } },
  onChangeTableParams,
  onFilterChange,
  expandable,
  footer,
}: IProps) => {
  const columnsRef = useRef(columns);
  const checkRef = useRef(new Array(columns.length).fill(true));
  const [checked, setChecked] = useState<boolean[]>(
    new Array(columns.length).fill(true)
  );

  const handleCheckChange = (event: CheckboxChangeEvent, idx: number, key: Key | undefined) => {
    // checkRef.current[idx] = event.target.checked;
    // columnsRef.current = columns.filter((col, idx) => checkRef.current[idx]);
    setChecked((prev) => {
      const newState = [...prev];
      newState[idx] = event.target.checked;
      return newState;
    });
    checkRef.current[idx] = event.target.checked;
    columnsRef.current = columns.filter((col, idx) => checkRef.current[idx]);
  };

  const ColumnMenu = () => {
    return (
      <Card>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline',
          }}
        >
          {columns.map((col, idx) => {
            return (
              <Checkbox
                key={col.key}
                onChange={(event) => handleCheckChange(event, idx, col.key)}
                checked={checked[idx]}
              >
                {col.title as string}
              </Checkbox>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <Row style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Col>
          <FiltrersTable columns={columns} onFilterChange={onFilterChange} />
        </Col>
        <Col>
          <Dropdown
            menu={{ items: [] }}
            placement='bottomRight'
            arrow={{ pointAtCenter: true }}
            dropdownRender={(menu) => <ColumnMenu />}
          >
            <Button type='text' style={{ color: blue.primary }}>
              {' '}
              Columnas <DownOutlined />{' '}
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Table
        columns={columnsRef.current}
        dataSource={data}
        pagination={{
          ...tableParams.pagination,
          pageSizeOptions: ['10', '25', '50', '100'],
          showSizeChanger: true,
        }}
        expandable={expandable}
        loading={loading}
        rowKey={(record) => record.id}
        scroll={{ x: '500px', y: '250px' }}
        onChange={onChangeTableParams}
        footer={footer}
      />
    </div>
  );
};

export default LoretaTable;
