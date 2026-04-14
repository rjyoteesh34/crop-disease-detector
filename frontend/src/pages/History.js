import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScanHistory } from '../services/api';
import {
    Container, Box, Typography, AppBar,
    Toolbar, Button, Card, CardContent,
    Divider, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function History() {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('english');
    const navigate = useNavigate();

    useEffect(() => {
        getScanHistory()
            .then(res => {
                setScans(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <AppBar position="static" color="success">
                <Toolbar>
                    <Button color="inherit" startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}>
                        Back
                    </Button>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                        📋 Scan History
                    </Typography>
                    <Button size="small"
                        variant={language === 'english' ? 'contained' : 'outlined'}
                        color="inherit" sx={{ mr: 1 }}
                        onClick={() => setLanguage('english')}>
                        English
                    </Button>
                    <Button size="small"
                        variant={language === 'tamil' ? 'contained' : 'outlined'}
                        color="inherit"
                        onClick={() => setLanguage('tamil')}>
                        தமிழ்
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    {loading ? (
                        <Box sx={{ textAlign: 'center', mt: 5 }}>
                            <CircularProgress color="success" />
                        </Box>
                    ) : scans.length === 0 ? (
                        <Typography align="center" color="text.secondary">
                            No scans yet! Upload a leaf photo to get started.
                        </Typography>
                    ) : (
                        scans.map((scan) => (
                            <Card key={scan.id} sx={{ mb: 2, bgcolor: '#f1f8e9' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <img src={scan.image_url} alt="leaf"
                                            style={{ width: 80, height: 80,
                                                borderRadius: 8, objectFit: 'cover' }} />
                                        <Box>
                                            <Typography variant="h6" color="green">
                                                {scan.disease_name}
                                            </Typography>
                                            <Typography variant="body2">
                                                Confidence: {scan.confidence_score}%
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(scan.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body2">
                                        <b>Remedy:</b> {language === 'english'
                                            ? scan.remedy_english
                                            : scan.remedy_tamil}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </Container>
        </>
    );
}

export default History;