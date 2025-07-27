import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PostItem = ({ user, image, caption }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.username}>{user?.username || 'Unknown'}</Text>
    </View>
    {image ? (
      <Image source={{ uri: image }} style={styles.image} />
    ) : null}
    {caption ? <Text style={styles.caption}>{caption}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', marginBottom: 16, padding: 8 },
  header: { marginBottom: 8 },
  username: { fontWeight: 'bold' },
  image: { width: '100%', height: 200, marginBottom: 8 },
  caption: { color: '#333' },
});

export default PostItem;
