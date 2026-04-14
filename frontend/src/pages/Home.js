import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadScan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Container, Box, Button, Typography,
    Paper, CircularProgress, Alert,
    AppBar, Toolbar, Card, CardContent, Divider
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';

function Home() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('english');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
    };

    const handleUpload = async () => {
        if (!image) {
            setError('Please select an image first!');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('image', image);
            const res = await uploadScan(formData);
            setResult(res.data);
        } catch (err) {
            setError('Failed to analyze image. Try again!');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static" color="success">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        🌿 Crop Disease Detector
                    </Typography>
                    <Typography sx={{ mr: 2 }}>
                        👨‍🌾 {user?.username}
                    </Typography>
                    <Button color="inherit" startIcon={<HistoryIcon />}
                        onClick={() => navigate('/history')}>
                        History
                    </Button>
                    <Button color="inherit" startIcon={<LogoutIcon />}
                        onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Upload Leaf Photo 📸
                        </Typography>
                        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
                            Take a photo of your crop leaf to detect disease
                        </Typography>

                        {/* Image Upload */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <input
                                type="file" accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload">
                                <Button variant="outlined" color="success"
                                    component="span"
                                    startIcon={<UploadFileIcon />}
                                    size="large">
                                    Choose Leaf Photo
                                </Button>
                            </label>
                        </Box>

                        {/* Preview */}
                        {preview && (
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <img src={preview} alt="leaf"
                                    style={{ maxWidth: '100%', maxHeight: 300,
                                        borderRadius: 8 }} />
                            </Box>
                        )}

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <Button fullWidth variant="contained" color="success"
                            onClick={handleUpload} disabled={loading || !image}
                            sx={{ py: 1.5 }}>
                            {loading ? <CircularProgress size={24} color="inherit" /> 
                                : '🔍 Detect Disease'}
                        </Button>

                        {/* Result */}
                        {result && (
                            <Card sx={{ mt: 3, bgcolor: '#f1f8e9' }}>
                                <CardContent>
                                    <Typography variant="h6" color="green">
                                        🌿 Detection Result
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography>
                                        <b>Disease:</b> {result.disease_name}
                                    </Typography>
                                    <Typography>
                                        <b>Confidence:</b> {result.confidence_score}%
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />

                                    {/* Language Toggle */}
                                    <Box sx={{ mb: 1 }}>
                                        <Button size="small"
                                            variant={language === 'english' ? 'contained' : 'outlined'}
                                            color="success" sx={{ mr: 1 }}
                                            onClick={() => setLanguage('english')}>
                                            English
                                        </Button>
                                        <Button size="small"
                                            variant={language === 'tamil' ? 'contained' : 'outlined'}
                                            color="success"
                                            onClick={() => setLanguage('tamil')}>
                                            தமிழ்
                                        </Button>
                                    </Box>

                                    <Typography variant="body2">
                                        <b>Remedy:</b> {language === 'english'
                                            ? result.remedy_english
                                            : result.remedy_tamil}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Paper>
                </Box>
            </Container>
        </>
    );
}

export default Home;