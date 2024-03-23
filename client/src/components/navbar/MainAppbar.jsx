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
    FormControl,
    InputLabel,
    Select,
    Stack,
} from '@mui/material';

// MUI Icons
import {
    Groups2 as Groups2Icon,
    LibraryBooks as LibraryBooksIcon,
    Quiz as QuizIcon,
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
    themeChange: PropTypes.func,
};

function MainAppbar({ themeChange, supportsPWA, promptInstall }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth);

    const mode = window.localStorage.getItem('healthAppTheme') || 'light';

    const [anchorEl, setAnchorEl] = useState(null);
    const [selected, setSelected] = useState(
        window.localStorage.getItem('healthAppLastPage') || 'groups'
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [twitterProfile, setTwitterProfile] = useState(
        currentUser?.socialLinks?.twitter
    );

    const [instagramProfile, setInstagramProfile] = useState(
        currentUser?.socialLinks?.instagram
    );

    const [avatarURL, setAvatarURL] = useState(currentUser?.photoURL);
    const [name, setName] = useState(currentUser?.name);
    const [buttonStatus, setButtonStatus] = useState(true);

    const onInstallClick = () => {
        if (!supportsPWA) {
            alert(
                'Either you have already installed the app or your browser does not support PWA :('
            );
            return;
        }
        promptInstall.prompt();
    };

    const renderInstallOption = () => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        } else {
            return (
                <MenuItem
                    onClick={() => {
                        onInstallClick();
                        handleMenuClose();
                    }}
                >
                    <DownloadIcon
                        sx={{
                            color: 'success.main',
                            fontSize: '1.7rem',
                            ml: -0.5,
                        }}
                    />
                    <ListItemText sx={{ ml: 1 }} primary='Install' />
                </MenuItem>
            );
        }
    };

    const handleSignOut = () => {
        const choice = window.confirm('Please click on OK to Log Out.');
        if (choice) {
            dispatch(signOutAction());
            window.localStorage.removeItem('healthAppLastPage');
            navigate('/');
        }
    };

    const handleNavigation = (value) => {
        setSelected(value);
        window.localStorage.setItem('healthAppLastPage', value);
        navigate(`/${value}`);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
        setButtonStatus(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'twitter') {
            setTwitterProfile(value);
        } else {
            setInstagramProfile(value);
        }
        setButtonStatus(false);
    };

    const removePhotoURL = () => {
        setAvatarURL(
            'https://media.istockphoto.com/id/1214428300/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=vftMdLhldDx9houN4V-g3C9k0xl6YeBcoB_Rk6Trce0='
        );
        setButtonStatus(false);
    };

    const changeAvatar = (e) => {
        const file = e?.target.files[0];
        if (file) {
            const fileExt = file?.name.split('.').pop();
            if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png') {
                const localUrl = URL.createObjectURL(file);
                setImageFile(file);
                setAvatarURL(localUrl);
                setButtonStatus(false);
            } else {
                alert(
                    'Please upload a valid image file of type jpg, jpeg or png'
                );
            }
        }
    };

    const saveChanges = async () => {
        if (!avatarURL || !name) {
            alert('Name cannot be empty');
            return;
        }
        const auth = window.localStorage.getItem('healthApp');
        const { dnd } = JSON.parse(auth);
        try {
            dispatch(startLoadingAction());
            let newURL = avatarURL;
            if (imageFile !== null) {
                // newURL = await uploadFile(imageFile);
            }
            const data = {
                name,
                photoURL: newURL,
                socialLinks: {
                    twitter: twitterProfile,
                    instagram: instagramProfile,
                },
            };
            const result = await axios({
                method: 'PATCH',
                url: `${import.meta.env.VITE_SERVER_URL}/api/user/edit`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${dnd}`,
                },
                data,
            });
            setButtonStatus(true);
            setName(result.data.result.name);
            setAvatarURL(result.data.result.photoURL);
            setTwitterProfile(result.data.result.socialLinks.twitter);
            setInstagramProfile(result.data.result.socialLinks.instagram);
            dispatch(
                signInAction(
                    result.data.result.uid,
                    result.data.result.email,
                    result.data.result.name,
                    result.data.result.photoURL,
                    result.data.result.username,
                    result.data.result.socialLinks,
                    result.data.result.token
                )
            );
            dispatch(stopLoadingAction());
            dispatch(
                notifyAction(true, 'success', 'Profile Updated Successfully')
            );
        } catch (err) {
            console.log(err);
        }
    };

    // const uploadFile = async (file) => {
    //     const id = uuid();
    //     await storage.createFile(
    //         import.meta.env.VITE_APPWRITE_BUCKET_ID,
    //         id,
    //         file
    //     );
    //     const result = storage.getFilePreview(
    //         import.meta.env.VITE_APPWRITE_BUCKET_ID,
    //         id
    //     );
    //     return result;
    // };

    const handleModalClose = () => {
        setModalVisible(false);
        setName(currentUser.name);
        setAvatarURL(currentUser.photoURL);
        setTwitterProfile(currentUser.socialLinks.twitter);
        setInstagramProfile(currentUser.socialLinks.instagram);
        setButtonStatus(true);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'success.main',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: '1000',
                padding: '7px',
                top: '0',
            }}
        >
            <Stack direction='row' alignItems='center'>
                <img
                    src={'/assets/vectors/logo-800x800.svg'}
                    alt='chat'
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        marginRight: '1rem',
                    }}
                />
                <Typography>Placeholder</Typography>
            </Stack>
            {currentUser.isSignedIn ? (
                <>
                    <CustomSwitcherGroup exclusive>
                        <CustomSwitcherButton
                            onClick={() => handleNavigation('groups')}
                            value='groups'
                            selected={selected === 'groups'}
                        >
                            <Groups2Icon /> Groups
                        </CustomSwitcherButton>
                        <CustomSwitcherButton
                            onClick={() => handleNavigation('blogs')}
                            value='blogs'
                            selected={selected === 'blogs'}
                        >
                            <LibraryBooksIcon /> Blogs
                        </CustomSwitcherButton>
                        <CustomSwitcherButton
                            onClick={() => handleNavigation('connect')}
                            value='connect'
                            selected={selected === 'connect'}
                        >
                            <GroupAddIcon /> Connect
                        </CustomSwitcherButton>
                        <CustomSwitcherButton
                            onClick={() => handleNavigation('exam')}
                            value='exam'
                            selected={selected === 'exam'}
                        >
                            <QuizIcon /> Take a Test
                        </CustomSwitcherButton>
                    </CustomSwitcherGroup>
                    <IconButton sx={{ p: '6px' }} onClick={handleMenuClick}>
                        <Avatar
                            alt={currentUser.name.charAt(0).toUpperCase()}
                            src={currentUser.photoURL}
                            sx={{
                                bgcolor: 'success.main',
                                color: 'primary.contrastText',
                                height: 50,
                                width: 50,
                                border: '2px solid',
                            }}
                        >
                            {currentUser.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: 'success.light',
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setModalVisible(true);
                            }}
                        >
                            <AccountBoxIcon
                                sx={{
                                    color: 'seagreen', // '#4caf50
                                    fontSize: '1.7rem',
                                    ml: -0.5,
                                }}
                            />
                            <ListItemText sx={{ ml: 1 }} primary='Profile' />
                        </MenuItem>
                        {/* {renderInstallOption()} */}
                        <MenuItem
                            onClick={() => {
                                handleSignOut();
                            }}
                        >
                            <LogoutIcon
                                sx={{
                                    color: 'error.light',
                                }}
                            />
                            <ListItemText sx={{ ml: 1 }} primary='Logout' />
                        </MenuItem>
                    </Menu>
                    <Modal open={modalVisible}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                minWidth: 600,
                                maxHeight: '700px',
                                backgroundColor: 'success.main',
                                boxShadow: 24,
                                borderRadius: '10px',
                                py: 2,
                                px: 4,
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <Typography
                                    variant='h5'
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Profile
                                </Typography>
                                <IconButton onClick={handleModalClose}>
                                    <CloseIcon
                                        sx={{
                                            color: 'error.main',
                                        }}
                                    />
                                </IconButton>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    width: '100%',
                                    py: 4,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Avatar
                                        alt={currentUser.name
                                            .charAt(0)
                                            .toUpperCase()}
                                        src={avatarURL}
                                        sx={{
                                            bgcolor: 'success.main',
                                            color: 'primary.contrastText',
                                            height: 150,
                                            width: 150,
                                            border: '2px solid',
                                        }}
                                    >
                                        {currentUser.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </Avatar>
                                    <Box sx={{ mt: 1 }}>
                                        <input
                                            accept='image/*'
                                            id='changeAvatar'
                                            type='file'
                                            style={{ display: 'none' }}
                                            onChange={changeAvatar}
                                        />

                                        <Button
                                            sx={{ mr: 1 }}
                                            color='info'
                                            variant='filled'
                                            size='small'
                                        >
                                            <label
                                                style={{ cursor: 'pointer' }}
                                                htmlFor='changeAvatar'
                                            >
                                                Change
                                            </label>
                                        </Button>
                                        <Button
                                            color='error'
                                            variant='outlined'
                                            size='small'
                                            onClick={removePhotoURL}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <TextField
                                        label='Name'
                                        color='success'
                                        variant='outlined'
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                    <Typography
                                        variant='subtitle1'
                                        sx={{
                                            mt: 2,
                                            color: 'white',
                                        }}
                                    >
                                        Username - {currentUser.username}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    width: '100%',
                                }}
                            >
                                <TextField
                                    sx={{
                                        width: '390px',
                                        mb: 4,
                                        mr: 1.5,
                                        color: 'white',
                                    }}
                                    value={twitterProfile}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'white',
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <TwitterIcon
                                                    sx={{
                                                        color: 'white',
                                                        fontSize: '2rem',
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    color='success'
                                    variant='outlined'
                                    name='twitter'
                                    label='Twitter Profile Link'
                                />
                                <TextField
                                    color='success'
                                    name='instagram'
                                    value={instagramProfile}
                                    label='Instagram Profile Link'
                                    sx={{
                                        width: '390px',
                                        color: 'white',
                                        mb: 0.5,
                                        mr: 1.5,
                                    }}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        sx: {
                                            color: 'white',
                                        },
                                    }}
                                    variant='outlined'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <InstagramIcon
                                                    sx={{
                                                        color: 'white',
                                                        fontSize: '2rem',
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Button
                                color='success'
                                sx={{
                                    mt: 3,
                                    backgroundColor: 'success.light',
                                    color: 'white',
                                    font: '500 0.9rem Poppins, sans-serif',
                                    ':hover': {
                                        backgroundColor: 'success.dark',
                                        color: 'black',
                                    },
                                }}
                                variant='contained'
                                disabled={buttonStatus}
                                onClick={saveChanges}
                            >
                                Save
                            </Button>
                        </Box>
                    </Modal>
                </>
            ) : (
                <Box sx={{ p: '3px' }}>
                    {/* <CustomSwitcherGroup>
                        <CustomSwitcherButton
                            onClick={() => navigate('/')}
                            value='/'
                        >
                            <GroupAddIcon /> Join Now
                        </CustomSwitcherButton>
                    </CustomSwitcherGroup> */}
                </Box>
            )}
            {/* Theme Swticher dropDown */}
            <FormControl variant='filled' sx={{ minWidth: 80 }}>
                <InputLabel id='demo-simple-select-autowidth-label'>
                    Mode
                </InputLabel>
                <Select
                    labelId='demo-simple-select-autowidth-label'
                    id='demo-simple-select-autowidth'
                    value={mode}
                    label='Age'
                    onChange={themeChange}
                >
                    <MenuItem value={'light'}>Light</MenuItem>
                    <MenuItem value={'dark'}>Dark</MenuItem>
                    <MenuItem value={'accesible'}>Accesible</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default MainAppbar;
