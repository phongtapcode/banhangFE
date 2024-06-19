import { Table } from "antd";
  
function TableComponent(props){
    const {columns , dataTable } = props;
    
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === "Disabled Product",
          name: record.name,
        }),
      };

    return(
        <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataTable}
        pagination={{
      pageSize: 8,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page, pageSize) => {
        console.log('Current page: ', page);
        console.log('Page size: ', pageSize);
      },
      onShowSizeChange: (current, size) => {
        console.log('Current page: ', current);
        console.log('New page size: ', size);
      }
    }}
        {...props}
      />
    )
}

export default TableComponent;