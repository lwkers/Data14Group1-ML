import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

interface DataType {
  key: string;
  name: string;
  location: string;
  probability: number;
}

type DataIndex = keyof DataType;


const fetchlocation = async (userId: string | null, setLoading: (loading: boolean) => void, setData: (data: DataType[]) => void) => {
  if (!userId) {
    console.error('Invalid user_id:', userId);
    setLoading(false);
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post(
      'https://a95gpboodl.execute-api.ap-southeast-2.amazonaws.com/dev/UserProducts2Web',
      { user_id: userId },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log('products', response.data);

    const products = response.data;

    // Fetch probability for each product and construct DataType array
    const locationPromises = products.map(async (product: any) => {
      try {
        const probabilityResponse = await axios.post(
          'https://a95gpboodl.execute-api.ap-southeast-2.amazonaws.com/dev/UserProductProbability2Web',
          { user_id: userId, product_id: product.product_id },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('probability', probabilityResponse.data);
        const probability = probabilityResponse.data;

        return {
          key: product.product_id,
          name: product.product_name,
          location: capitalizeFirstLetter(`${product.aisle} - ${product.department}`),
          probability: convertToPercentage(probability)
        };
      } catch (error) {
        console.error('Error fetching probability:', error);
        //dummy probability for pagination
        return {
          key: product.product_id,
          name: product.product_name,
          location: capitalizeFirstLetter(`${product.aisle} - ${product.department}`),
          probability: generateRandomPercentage()
        };
      }
    });

    const location = await Promise.all(locationPromises);
    const validlocation = location.filter((product) => product !== null) as DataType[];

    setData(validlocation);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

function convertToPercentage(decimalNumber:number) {
    let percentage = (decimalNumber * 100).toFixed(2);

    let percentageString = percentage + "%";

    return percentageString;
}

function capitalizeFirstLetter(str:any) {
    let words = str.split(' ');

    let capitalizedWords = words.map((word:any) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return capitalizedWords.join(' ');
}

function generateRandomPercentage() {
    let percentage = Math.random() * 100; 
    return percentage.toFixed(2) + '%'; 
}


export default function ResultsTable({ userId }:any) {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  
  const [data, setData] = useState<DataType[]>([]);
  console.log("🚀 ~ ResultsTable ~ data:", data)
  
  useEffect(() => {
    if (userId) fetchlocation(userId, setLoading, setData);
  }, [userId]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Location (Aisle - Department)',
      dataIndex: 'location',
      key: 'location',
      width: '40%',
      ...getColumnSearchProps('location'),
    },
    {
      title: 'Probability (%)',
      dataIndex: 'probability',
      key: 'probability',
      ...getColumnSearchProps('probability'),
      defaultSortOrder: 'descend',
      sorter: (a, b) => parseFloat(a.probability.toString()) - parseFloat(b.probability.toString()),
      // sortDirections: ['descend', 'ascend'],
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} loading={loading}/>
    </>
  )
};