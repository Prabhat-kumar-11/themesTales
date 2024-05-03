// components/SearchBar.js
import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBar = ({ handleSearch }) => {
  return <Search placeholder="Search posts" onSearch={handleSearch} enterButton />;
};

export default SearchBar;
