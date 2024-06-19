import './Checkbox.scss';
import { useState } from 'react';
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
const defaultCheckedList = ['Apple', 'Orange'];

const CheckboxComponent = ({dataCategory,onCheckboxChange}) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const handleOnChange = (list) => {
    setCheckedList(list);
    onCheckboxChange({filter: dataCategory.filter,listFilter: list});
  };

  return (
    <>
      <h1>
        {dataCategory.title}
      </h1>
      <CheckboxGroup options={dataCategory.category} value={checkedList} onChange={handleOnChange} />
    </>
  );
};
export default CheckboxComponent;