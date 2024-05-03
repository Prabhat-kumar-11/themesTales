import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Table, Tag, Layout, Button, Select } from "antd";
import axios from "axios";
import FilterBar from "../Components/FilterBar";
import SearchBar from "../Components/SearchBar";

const { Content } = Layout;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPageParam = queryParams.get("page");
  const currentPage = currentPageParam ? parseInt(currentPageParam) : 1;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get("search") || ""
  );
  const [totalPage, setTotalPage] = useState(0);

  const skip = parseInt(queryParams.get("skip"), 10) || 0;
  const limit = 10;

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Body", dataIndex: "body", key: "body" },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Reactions",
      dataIndex: "reactions",
      key: "reactions",
      render: (reactions) => (
        <span>
          {reactions} {reactions === 1 ? "reaction" : "reactions"}
        </span>
      ),
    },
  ];

  const fetchPosts = async (page) => {
    const limit = 10;
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/posts?skip=${skip}&limit=${limit}`;
    if (searchQuery) {
      url = `https://dummyjson.com/posts/search?q=${searchQuery}&skip=${skip}&limit=${limit}`;
    }
    try {
      const response = await axios.get(url);
      setPosts(response.data.posts);
      setTotalPage(response.data.total);

      queryParams.set("page", page);
      if (searchQuery) {
        queryParams.set("search", searchQuery);
      } else {
        queryParams.delete("search");
      }
      navigate({ search: queryParams.toString() });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, searchQuery]);

  const handleReset = () => {
    setSelectedTags([]);
    setSearchQuery("");
    navigate("/home");
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) => [...prevTags, tag]);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    queryParams.set("page", "1");
    navigate(`/home?skip=0&tags=${selectedTags.join(",")}&search=${value}`);
  };

  const handleNewFilter = (value) => {
    console.log("Selected filter:", value);
  };

  return (
    <Layout>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}
      >
        Theme Tales
      </div>

      <Content style={{ padding: "0 50px" }}>
        <SearchBar handleSearch={handleSearch} />
        <Button type="primary" onClick={handleReset} style={{ marginBottom: '10px' }}>Reset Filters</Button>
        <Select
          style={{ width: 200, marginBottom: '10px' }}
          placeholder="Select Filter"
          onChange={handleNewFilter}
          value={selectedTags}
          onSelect={handleTagChange}
          mode="multiple"
        >
          {["crime", "history", "american", "magical", "english", "french", "mystery"].map((tag) => (
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          ))}
        </Select>
        <Table
          columns={columns}
          dataSource={posts}
          loading={loading}
          pagination={{
            pageSize: limit,
            total: totalPage,
            current: currentPage,
            onChange: (page) => fetchPosts(page),
          }}
        />
      </Content>
    </Layout>
  );
};

export default Home;
