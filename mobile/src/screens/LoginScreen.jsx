import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser, setToken, setLoading, setError } from '../store/slices/authSlice';
import { login, getCurrentUser } from '../api/auth';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ login: '', password: '' });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    try {
      const res = await login(form);
      dispatch(setToken(res.data.access));
      await AsyncStorage.setItem('token', res.data.access);
      if (res.data.refresh) {
        await AsyncStorage.setItem('refresh', res.data.refresh);
      }

      try {
        const userRes = await getCurrentUser();
        dispatch(setUser(userRes.data));
      } catch (profileErr) {
        console.error('Failed to fetch user profile:', profileErr);
      }

      navigation.navigate('Feed');
    } catch (err) {
      dispatch(setError(err.response?.data?.detail || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLANX Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={form.login}
        onChangeText={(text) => handleChange('login', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleSubmit} disabled={loading} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});

export default LoginScreen;
