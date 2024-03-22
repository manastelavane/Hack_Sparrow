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
import MainAppbar from './components/navbar/MainAppbar';

// Routes
import Groups from './components/routes/groups/Groups';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    const isSignedIn = true;

    const changingTheme = createTheme({
        palette: {
            mode: 'light',
        },

        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    });

    const themeChange = (mode) => {
        // Change in local storage
        localStorage.setItem('healthAppTheme', mode);
    };

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);
    }, []);

    return (
        <ThemeProvider theme={changingTheme}>
            <CssBaseline />
            {isSignedIn && (
                <MainAppbar
                    {...{
                        themeChange,
                        supportsPWA,
                        promptInstall,
                    }}
                />
            )}
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/groups' element={<Groups />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
