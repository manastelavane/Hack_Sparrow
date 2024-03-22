//React
import { useState } from 'react';

//React-Redux
import { useDispatch, useSelector } from 'react-redux';

//React-Router
import { useNavigate } from 'react-router-dom';

//UUID
import { v4 as uuid } from 'uuid';

//Axios
import axios from 'axios';

// MUI Core Components
import {
    Avatar,
    Box,
    Button,
    Menu,
    Modal,
    MenuItem,
    Typography,
    TextField,
    InputAdornment,
    ListItemText,
    IconButton,
} from '@mui/material';

// MUI Icons
import {
    Groups2 as Groups2Icon,
    LibraryBooks as LibraryBooksIcon,
    Quiz as QuizIcon,
    LightMode as LightModeIcon,
    Logout as LogoutIcon,
    Close as CloseIcon,
    GroupAdd as GroupAddIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    AccountBox as AccountBoxIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';

// Appwrite
// import storage from '../../appwrite';

import {
    CustomSwitcherGroup,
    CustomSwitcherButton,
} from './custom-switcher/CustomSwitcher';

// Actions
import {
    signOutAction,
    stopLoadingAction,
    startLoadingAction,
    signInAction,
    notifyAction,
} from '../../actions/actions';

// Props: supportsPWA, promptInstall

import PropTypes from 'prop-types';

MainAppbar.propTypes = {
    supportsPWA: PropTypes.bool,
    promptInstall: PropTypes.func,
};

function MainAppbar({ supportsPWA, promptInstall }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth);

    return (
        <Box
            sx={{
                position: 'fixed',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'primary.main',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: '1000',
                padding: '7px',
                top: '0',
            }}
        >
            <img
                src={'/assets/vectors/logo-800x800.svg'}
                alt='chat'
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                }}
            />
            {currentUser.isSignedIn ? (
                <> </>
            ) : (
                <Box sx={{ p: '3px' }}>
                    <CustomSwitcherGroup>
                        <CustomSwitcherButton
                            onClick={() => navigate('/')}
                            value='/'
                        >
                            <GroupAddIcon /> Join Now
                        </CustomSwitcherButton>
                    </CustomSwitcherGroup>
                </Box>
            )}
        </Box>
    );
}

export default MainAppbar;
