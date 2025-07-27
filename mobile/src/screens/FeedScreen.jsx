import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setLoading, setError } from '../store/slices/postSlice';
import { fetchFeed } from '../api/posts';
import PostList from '../components/PostList';

const FeedScreen = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const res = await fetchFeed();
        dispatch(setPosts(res.data));
      } catch {
        dispatch(setError('Failed to load feed.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <PostList posts={posts} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }
});

export default FeedScreen;
