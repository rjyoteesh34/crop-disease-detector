import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Container, Box, TextField, Button,
    Typography, Paper, Alert
} from '@mui/material';

function Register() {
    const [form, setForm] = useState({
        username: '', email: '', password: '',
        phone: '', village: '', district: ''
    });
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
            const res = await registerUser(form);
            login(res.data.user, res.data.access, res.data.refresh);
            navigate('/');
        } catch (err) {
            setError('Registration failed! Try different username.');
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" align="center" color="green" gutterBottom>
                        🌿 Crop Disease Detector
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        Farmer Registration
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Username" name="username"
                            value={form.username} onChange={handleChange}
                            margin="normal" required />
                        <TextField fullWidth label="Email" name="email"
                            type="email" value={form.email}
                            onChange={handleChange} margin="normal" required />
                        <TextField fullWidth label="Password" name="password"
                            type="password" value={form.password}
                            onChange={handleChange} margin="normal" required />
                        <TextField fullWidth label="Phone Number" name="phone"
                            value={form.phone} onChange={handleChange}
                            margin="normal" />
                        <TextField fullWidth label="Village" name="village"
                            value={form.village} onChange={handleChange}
                            margin="normal" />
                        <TextField fullWidth label="District" name="district"
                            value={form.district} onChange={handleChange}
                            margin="normal" />
                        <Button fullWidth variant="contained" color="success"
                            type="submit" sx={{ mt: 2, py: 1.5 }}
                            disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <Typography align="center" sx={{ mt: 2 }}>
                        Already have account? <Link to="/login">Login here</Link>
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}

export default Register;