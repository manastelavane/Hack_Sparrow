// React
import { useState, useEffect } from 'react';

// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Redux
import { useDispatch } from 'react-redux';

// React Router
import { useNavigate, Routes, Route } from 'react-router-dom';

// Components
import LandingPage from './components/routes/LandingPage';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
            mode: 'light',
        },

        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path='/' element={<LandingPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
