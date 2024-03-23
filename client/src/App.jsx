// React
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

//Actions
import { signInAction } from './actions/actions';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
import VoiceRoom from './components/routes/groups/VoiceRoom';

// Routes
import Groups from './components/routes/groups/Groups';
import Blogs from './components/routes/blogs/Blogs';

// Themes
import themes from './utils/themes';

function App() {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState(null);

    const isSignedIn = useSelector((state) => state.auth.isSignedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        const token = window.localStorage.getItem('healthApp');
        // console.log(token);
        const auth = JSON.parse(token);
        if (auth?.isSignedIn) {
            const { dnd } = auth;
            const { uid, email, name, photoURL, username, socialLinks } =
                jwtDecode(dnd);
            // console.log(uid, email, name, photoURL, username, socialLinks, dnd);
            dispatch(
                signInAction(
                    true,
                    uid,
                    email,
                    name,
                    photoURL,
                    username,
                    socialLinks,
                    dnd
                )
            );
            if (
                location.pathname.includes('/connect/pc/') ||
                location.pathname.includes('/blog/')
            ) {
                navigate(location.pathname);
                return;
            }
            const value = window.localStorage.getItem('healthAppLastPage');
            if (value && value !== undefined) {
                navigate(`/${value}`);
            } else {
                navigate('/groups');
            }
        }
        return () => window.removeEventListener('transitionend', handler);
    }, []);

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
                    path='/room/:id'
                    element={
                        <ProtectedRoute>
                            <HMSRoomProvider>
                                <VoiceRoom mode={mode} />
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
