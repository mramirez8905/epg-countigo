import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
} from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';

import {
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { filtersSelectNumberOrDate, filtersSelectString } from './filterValues';
import { isNullOrUndefined } from '@/utils/utils';
import { convertStringToObject } from '@/utils/filter-transformer';
import { CountTVColumnsType } from '@/interfaces/strapiBase.interface';

interface IFiltersProps {
  columns: CountTVColumnsType<any>[];
  onFilterChange: (filters: any) => void;
}

type DataType = 'string' | 'number' | 'date';

const handleFieldChange = (dataType: DataType = 'string') => {
  return dataType === 'string'
    ? filtersSelectString
    : filtersSelectNumberOrDate;
};

const FiltrersTable: FC<IFiltersProps> = ({ columns, onFilterChange }) => {
  const [selectedColunm, setSelectedColunm] = useState(columns[0]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({ filters: {} });
  const [selectFilters, setSelectFilters] = useState(() => {
    return handleFieldChange(columns[0].dataType || 'string');
  });
  const [selectedFilter, setSelectedFilter] = useState<string>();
  const [selectedFilterValue, setSelectedFilterValue] = useState<any>();
  const [filterList, setFilterList] = useState<
    { key: string; label: string }[]
  >([]);

  const [selectFieldOptions, setSelectFieldOptions] = useState(() =>
    columns.map((col) => {
      return { value: col.key, label: col.title };
    })
  );

  // const filtersRef = useRef();
  // const [listening, setListening] = useState(false);

  // useEffect(
  //   listenForOutsideClicks(listening, setListening, filtersRef, setIsOpen)
  // );

  const handleFieldSelect = (value: string) => {
    const updateColumn = columns.find((col) => col.key === value);
    setSelectedColunm(() => updateColumn!);
    setSelectFilters(() =>
      handleFieldChange(updateColumn!.dataType || 'string')
    );
  };

  const handleAddFilter = () => {
    const keys = `${selectedColunm.key}.${selectedFilter}`;
    const selectedColumnKey = selectedColunm?.key?.toString().split('.')[0];
    const selectedFilterLabel = selectFilters?.find((filter) => filter.value === selectedFilter)?.label.toLocaleLowerCase();

    const filterObj = convertStringToObject(keys, selectedFilterValue);
    setFilters((prev: any) => {
      const newState = { ...prev };
      newState['filters'] = { ...newState['filters'], ...filterObj };
      onFilterChange(newState);
      return newState;
    });
    setFilterList((prev) => {
      const newState = [...prev];
      newState.push({
        key: selectedColumnKey!,
        label: `${selectedColunm.title} ${selectedFilterLabel} ${selectedFilterValue}`,
      });
      return newState;
    });
    setSelectedFilter(undefined);
    setSelectedFilterValue(undefined);
  };

  const handleRemove = (idx: number) => {
    const key = filterList[idx].key;
    setFilters((prev: any) => {
      const newState = { ...prev };
      delete newState['filters'][key];
      onFilterChange(newState);
      return newState;
    });
    setFilterList((prev) => {
      const newState = [...prev];
      newState.splice(idx, 1);
      return newState;
    });
  };

  return (
    <Col>
      <Dropdown
        open={isOpen}
        menu={{ items: [] }}
        trigger={['click']}
        placement='bottomLeft'
        dropdownRender={(menu) => (
          <Card>
            {/* <Card onMouseLeave={() => setIsOpen(false)}> */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignContent: 'space-evenly',
                width: '15rem',
              }}
            >
              <Select
                style={{ width: '100%' }}
                options={selectFieldOptions.filter(
                  (opt) => opt.label !== 'Acciones'
                )}
                defaultValue={selectFieldOptions[0].value as string}
                onChange={handleFieldSelect}
                placeholder={'Campo'}
              />
              <Select
                style={{ width: '100%', marginTop: '5px' }}
                options={selectFilters}
                value={selectedFilter}
                onChange={(value) => {
                  if (value === '$null' || value === '$notNull') {
                    setSelectedFilterValue(true);
                  }
                  setSelectedFilter(value);
                }}
                placeholder={'Filtro'}
              />
              {(selectedColunm.dataType === 'number' ||
                (selectedColunm.dataType === 'string' &&
                  selectedFilter !== '$null' &&
                  selectedFilter !== '$notNull')) && (
                <Input
                  style={{ marginTop: '5px' }}
                  type={selectedColunm.dataType === 'number' ? 'number' : ''}
                  value={selectedFilterValue}
                  onChange={(event) => {
                    setSelectedFilterValue(event.target.value);
                  }}
                  placeholder={'Valor'}
                />
              )}
              {selectedColunm.dataType === 'date' &&
                selectedFilter !== '$null' &&
                selectedFilter !== '$notNull' && (
                  <DatePicker
                    style={{ marginTop: '5px' }}
                    allowClear
                    value={selectedFilterValue}
                    onChange={(event) => {
                      setSelectedFilterValue(event);
                    }}
                    placeholder={'Valor'}
                  />
                )}
              <Button
                style={{ marginTop: '5px', alignSelf: 'center' }}
                icon={<PlusOutlined />}
                disabled={
                  isNullOrUndefined(selectedFilter) ||
                  isNullOrUndefined(selectedFilterValue)
                }
                onClick={() => {
                  // onFilterAdd(filters);
                  handleAddFilter();

                  setIsOpen(false);
                }}
              >
                {' '}
                {'Agregar Filtro'}{' '}
              </Button>
            </div>
          </Card>
        )}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Tooltip title={'Filtros'}>
              <FilterOutlined onClick={() => setIsOpen(!isOpen)} />
            </Tooltip>
          </Space>
        </a>
      </Dropdown>
      <Row style={{ marginBottom: '10px' }}>
        {filterList.map((item, idx) => {
          return (
            <div
              key={idx}
              style={{
                border: 'solid #d9d9d9 0.5px',
                backgroundColor: '#d9d9d9',
                borderRadius: '30px',
                padding: '0px 10px',
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '10px',
              }}
            >
              {item.label}
              <CloseOutlined
                style={{ marginLeft: '10px', color: '#a8071a' }}
                onClick={() => handleRemove(idx)}
              />
            </div>
          );
        })}
      </Row>
    </Col>
  );
};

export default FiltrersTable;
