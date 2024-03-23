// React
import { useState, useEffect } from 'react';

// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Redux
import { useSelector } from 'react-redux';

// React Router
import { Routes, Route } from 'react-router-dom';

// HMS
import { HMSRoomProvider } from '@100mslive/hms-video-react';

// Components
import LandingPage from './components/routes/LandingPage';
import MainAppbar from './components/navbar/MainAppbar';
import ProtectedRoute from './components/helpers/ProtectedRoute';
import Loading from './components/helpers/Loading';
import Notify from './components/helpers/Notify';

// Routes
import Groups from './components/routes/groups/Groups';
import Blogs from './components/routes/blogs/Blogs';

// Themes
import themes from './utils/themes';

function App() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    const isSignedIn = useSelector((state) => state.auth.isSignedIn);

    const localTheme = window.localStorage.getItem('healthAppTheme');

    const [mode, setMode] = useState(localTheme ? localTheme : 'light');

    const changingTheme = createTheme(themes[mode]);

    const themeChange = (event) => {
        setMode(event.target.value);
        // Change in local storage
        window.localStorage.setItem('healthAppTheme', event.target.value);
    };

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);
        localStorage.setItem('healthAppTheme', 'light');
    }, []);

    return (
        <ThemeProvider theme={changingTheme}>
            <CssBaseline />
            <Loading />
            <Notify />
            {isSignedIn && (
                <MainAppbar
                    {...{
                        mode,
                        themeChange,
                        supportsPWA,
                        promptInstall,
                    }}
                />
            )}
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route
                    path='/groups'
                    element={
                        <ProtectedRoute>
                            <HMSRoomProvider>
                                <Groups />
                            </HMSRoomProvider>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/blogs'
                    element={
                        <ProtectedRoute>
                            <HMSRoomProvider>
                                <Blogs />
                            </HMSRoomProvider>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
