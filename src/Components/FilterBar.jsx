import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const FilterBar = ({ tags, selectedTags, handleTagChange }) => {
  return (
    <Select
      mode="multiple"
      placeholder="Select tags"
      value={selectedTags}
      onChange={handleTagChange}
      style={{ width: '100%' }}
    >
      {tags.map((tag) => (
        <Option key={tag}>{tag}</Option>
      ))}
    </Select>
  );
};

export default FilterBar;
