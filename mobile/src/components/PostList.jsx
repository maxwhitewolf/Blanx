import React from 'react';
import { FlatList } from 'react-native';
import PostItem from './PostItem';

const PostList = ({ posts }) => (
  <FlatList
    data={posts}
    keyExtractor={(item) => String(item.id)}
    renderItem={({ item }) => <PostItem {...item} />}
  />
);

export default PostList;
