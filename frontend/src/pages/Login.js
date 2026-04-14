import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Container, Box, TextField, Button,
    Typography, Paper, Alert
} from '@mui/material';

function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await loginUser(form);
            login(res.data.user, res.data.access, res.data.refresh);
            navigate('/');
        } catch (err) {
            setError('Invalid username or password!');
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" align="center" color="green" gutterBottom>
                        🌿 Crop Disease Detector
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Farmer Login
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth label="Username" name="username"
                            value={form.username} onChange={handleChange}
                            margin="normal" required
                        />
                        <TextField
                            fullWidth label="Password" name="password"
                            type="password" value={form.password}
                            onChange={handleChange} margin="normal" required
                        />
                        <Button
                            fullWidth variant="contained" color="success"
                            type="submit" sx={{ mt: 2, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                    <Typography align="center" sx={{ mt: 2 }}>
                        No account? <Link to="/register">Register here</Link>
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login;