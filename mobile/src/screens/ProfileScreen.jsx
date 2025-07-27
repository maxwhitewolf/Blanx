import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { getProfile } from '../api/auth';
import { fetchUserPosts } from '../api/posts';

const ProfileScreen = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;
      try {
        const res = await getProfile(currentUser.username);
        setProfile(res.data);
        const postRes = await fetchUserPosts(currentUser.username);
        setPosts(postRes.data);
      } catch {}
    };
    load();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <View style={styles.centered}>
        <Text>Please log in.</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholder]} />
        )}
        <Text style={styles.username}>{profile.username}</Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  placeholder: { backgroundColor: '#ccc' },
  username: { fontSize: 20, fontWeight: 'bold' },
  postImage: { width: '33%', aspectRatio: 1 },
});

export default ProfileScreen;
