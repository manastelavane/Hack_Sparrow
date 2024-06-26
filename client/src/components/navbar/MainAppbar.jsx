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
    Select,
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
    // Download as DownloadIcon,
} from '@mui/icons-material';

// Appwrite
import storage from '../../appwrite';

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

function MainAppbar({
    changingTheme,
    mode,
    themeChange,
    // supportsPWA,
    // promptInstall,
}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.auth);

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
    const [bio, setBio] = useState(currentUser?.bio);
    const [username, setUsername] = useState(currentUser?.username);
    const [buttonStatus, setButtonStatus] = useState(true);

    // const onInstallClick = () => {
    //     if (!supportsPWA) {
    //         alert(
    //             'Either you have already installed the app or your browser does not support PWA :('
    //         );
    //         return;
    //     }
    //     promptInstall.prompt();
    // };

    // const renderInstallOption = () => {
    //     if (window.matchMedia('(display-mode: standalone)').matches) {
    //         return;
    //     } else {
    //         return (
    //             <MenuItem
    //                 onClick={() => {
    //                     onInstallClick();
    //                     handleMenuClose();
    //                 }}
    //             >
    //                 <DownloadIcon
    //                     sx={{
    //                         fontSize: '1.7rem',
    //                         ml: -0.5,
    //                     }}
    //                 />
    //                 <ListItemText sx={{ ml: 1 }} primary='Install' />
    //             </MenuItem>
    //         );
    //     }
    // };

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

    const handleBioChange = (event) => {
        setBio(event.target.value);
        setButtonStatus(false);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
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
        if (!avatarURL || !bio || !username) {
            alert('Name cannot be empty');
            return;
        }
        const auth = window.localStorage.getItem('healthApp');
        const { dnd } = JSON.parse(auth);
        try {
            dispatch(startLoadingAction());
            let newURL = avatarURL;
            if (imageFile !== null) {
                newURL = await uploadFile(imageFile);
            }
            const data = {
                updatedUsername: username,
                bio,
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
            setBio(result.data.result.bio);
            setAvatarURL(result.data.result.photoURL);
            setTwitterProfile(
                result.data.result.socialLinks.twitter.toString()
            );
            setInstagramProfile(
                result.data.result.socialLinks.instagram.toString()
            );
            dispatch(
                signInAction(
                    true,
                    result.data.result.uid,
                    result.data.result.email,
                    result.data.result.bio,
                    result.data.result.photoURL,
                    result.data.result.name,
                    result.data.result.username,
                    result.data.result.socialLinks,
                    result.data.result.testResults,
                    result.data.result.isPrivacyAccepted,
                    result.data.result.reportedBy,
                    result.data.result._id,
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

    const uploadFile = async (file) => {
        const id = uuid();
        await storage.createFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            id,
            file
        );
        const result = storage.getFilePreview(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            id
        );
        return result;
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setBio(currentUser.bio);
        setUsername(currentUser.username);
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
                    marginRight: '1rem',
                }}
            />
            {currentUser.isSignedIn ? (
                <>
                    <CustomSwitcherGroup exclusive theme={changingTheme}>
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
                            alt={currentUser.username.charAt(0).toUpperCase()}
                            src={currentUser.photoURL}
                            sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                height: 50,
                                width: 50,
                                border: '2px solid',
                            }}
                        >
                            {currentUser.username.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: 'primary.light',
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
                            <LogoutIcon />
                            <ListItemText sx={{ ml: 1 }} primary='Logout' />
                        </MenuItem>

                        <MenuItem>
                            {/* Theme Swticher dropDown */}
                            <FormControl
                                variant='outlined'
                                sx={{ minWidth: 80, height: 50 }}
                            >
                                <Select
                                    labelId='demo-simple-select-autowidth-label'
                                    id='demo-simple-select-autowidth'
                                    value={mode}
                                    onChange={themeChange}
                                    sx={{ height: 40, mt: 1 }}
                                >
                                    <MenuItem value='light'>Light</MenuItem>
                                    <MenuItem value='dark'>Dark</MenuItem>
                                    <MenuItem value='highContrast'>
                                        High Contrast
                                    </MenuItem>
                                    <MenuItem value='redWeakProtoanomaly'>
                                        Red Weak Protoanomaly
                                    </MenuItem>

                                    <MenuItem value='greenBlindDeuteranopia'>
                                        Green Blind Deuteranomaly
                                    </MenuItem>

                                    <MenuItem value='blueWeakTritanomaly'>
                                        Blue Weak Tritanomaly
                                    </MenuItem>
                                </Select>
                            </FormControl>
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
                                backgroundColor: 'primary.main',
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
                                    sx={{ fontWeight: 'bold' }}
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
                                        alt={currentUser.username
                                            .charAt(0)
                                            .toUpperCase()}
                                        src={avatarURL}
                                        sx={{
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText',
                                            height: 150,
                                            width: 150,
                                            border: '2px solid',
                                        }}
                                    >
                                        {currentUser.username
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
                                            color='secondary'
                                            variant='contained'
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
                                            variant='contained'
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
                                        label='Username'
                                        color='success'
                                        variant='outlined'
                                        value={username}
                                        onChange={handleUsernameChange}
                                    >
                                        {currentUser.username}
                                    </TextField>
                                    <br />
                                    <TextField
                                        label='Bio'
                                        color='success'
                                        variant='outlined'
                                        value={bio}
                                        onChange={handleBioChange}
                                        fullWidth
                                    />
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
                                        width: '500px',
                                        mb: 4,
                                        mr: 1.5,
                                        color: 'white',
                                    }}
                                    value={twitterProfile}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <TwitterIcon
                                                    sx={{
                                                        color: 'secondary.dark',
                                                        fontSize: '2rem',
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    color='secondary'
                                    variant='outlined'
                                    name='twitter'
                                    label='Twitter Profile Link'
                                />
                                <TextField
                                    color='secondary'
                                    name='instagram'
                                    value={instagramProfile}
                                    label='Instagram Profile Link'
                                    sx={{
                                        width: '500px',
                                        color: 'white',
                                        mb: 0.5,
                                        mr: 1.5,
                                    }}
                                    onChange={handleInputChange}
                                    variant='outlined'
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <InstagramIcon
                                                    sx={{
                                                        color: 'secondary.dark',
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
                                    font: '500 0.9rem Poppins, sans-serif',
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
        </Box>
    );
}

export default MainAppbar;
