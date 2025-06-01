import { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
// import api from '../api/api';
// import { setToken } from '../utils/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // try {
    //   const res = await api.post('/auth/login', { username, password });
    //   setToken(res.data.token);
    //   window.location.href = '/';
    // } catch (err) {
    //   alert('Login failed');
    // }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Container>
  );
}
