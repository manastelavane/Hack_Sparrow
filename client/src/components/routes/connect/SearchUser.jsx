import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddCommentIcon from '@mui/icons-material/AddComment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import { notifyAction } from '../../../actions/actions';
// import { otherUser } from './Connect';
import ProfileInfo from './ProfileInfo';

const SearchUser = ({ mode, handleChatClick }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth);
    const [searchStatus, setSearchStatus] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [timer, setTimer] = useState();
    const [profileInfoOpen, setProfileInfoOpen] = useState(false);
    const [otherUser, setOtherUser] = useState(null);

    const handleSearch = (event) => {
        if (event.target.value.length > 0) {
            clearTimeout(timer);
            setSearchStatus('Searching...');
            const newTimer = setTimeout(async () => {
                try {
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_SERVER_URL}/api/user/${
                            currentUser.uid
                        }?search=${event.target.value}`
                    );
                    setSearchResults(data.result);
                } catch (error) {
                    dispatch(
                        notifyAction(
                            true,
                            'error',
                            'It seems something is wrong, please log out and log in again. in a minute :('
                        )
                    );
                    console.log(error);
                }
                setSearchStatus(null);
            }, 1100);
            setTimer(newTimer);
        } else {
            setSearchResults(null);
        }
    };

    const createChat = async (user) => {
        const cId = currentUser.uid ? currentUser.uid : '';
        const chatId = cId > user.uid ? cId + user.uid : user.uid + cId;
        const lastMessageTime = Date.now();
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/chat`, {
                chatId,
                userOneInfo: user,
                userTwoInfo: currentUser,
                lastMessageTime,
            });
            handleChatClick({ ...user, new: true });
        } catch (error) {
            dispatch(
                notifyAction(
                    true,
                    'error',
                    'It seems something is wrong, please log out and log in again. in a minute :('
                )
            );
            console.log(error);
        }
    };

    const handleShowProfileInfo = (user) => {
        setOtherUser(user);
        setProfileInfoOpen(true);
    };

    return (
        <Box sx={{ position: 'relative', height: 'inherit' }}>
            <List sx={{ p: 0 }}>
                <TextField
                    autoFocus
                    label='Search for users'
                    onChange={handleSearch}
                    sx={{
                        m: 2,
                        width: '90%',
                        '& .MuiOutlinedInput-root': {
                            paddingRight: '6px',
                            borderRadius: '20px',

                            // '&.Mui-focused fieldset': {
                            //     borderColor: dark,
                            // },
                        },
                        // '& .MuiInputLabel-root.Mui-focused': {
                        //     color: dark,
                        // },
                    }}
                    InputProps={{
                        endAdornment: (
                            <Tooltip title='Search for users by typing their username'>
                                <InputAdornment position='end'>
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            </Tooltip>
                        ),
                    }}
                    size='small'
                />
                <Divider />
                {searchResults &&
                    searchResults.map((user) => (
                        <ListItem
                            key={user.uid}
                            sx={{
                                p: 0,
                                pl: 2,
                                height: '70px',
                                borderBottom:
                                    mode === 'light'
                                        ? '1px solid rgba(0, 0, 0, 0.12)'
                                        : '1px solid rgba(255, 255, 255, 0.12)',
                            }}
                        >
                            <Avatar
                                src={user?.photoURL}
                                alt='user avatar'
                                sx={{
                                    width: 50,
                                    height: 50,
                                    // backgroundColor:
                                    //     mode === 'light' ? deepDark : medium,
                                }}
                            >
                                {user.username[0].toUpperCase()}
                            </Avatar>
                            <Typography
                                sx={{
                                    fontSize: '1rem',
                                    ml: 2,
                                }}
                            >
                                {user.username}
                            </Typography>
                            <Tooltip
                                title={`View ${user.username}'s Profile`}
                                placement='bottom'
                            >
                                <IconButton
                                    sx={{
                                        ml: 'auto',
                                    }}
                                    onClick={() => handleShowProfileInfo(user)}
                                >
                                    <RemoveRedEyeIcon
                                        sx={{
                                            fontSize: '30px',
                                            // color: deepDark,
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title={`Start a conversation with ${user.username}`}
                                placement='right'
                            >
                                <IconButton
                                    sx={{
                                        mr: 1,
                                    }}
                                    onClick={() => createChat(user)}
                                >
                                    <AddCommentIcon
                                        sx={{
                                            fontSize: '30px',
                                            // color: deepDark,
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                    ))}
            </List>
            {searchStatus && (
                <img
                    style={{
                        alignSelf: 'center',
                        width: '200px',
                        position: 'absolute',
                        top: '36%',
                        right: '25%',
                    }}
                    src='/assets/vectors/searching.svg'
                    alt=''
                />
            )}
            {searchResults && searchResults.length === 0 && (
                <Typography
                    sx={{
                        fontSize: '1.1rem',
                        ml: 2,
                        mt: 2,
                        mb: 1,
                    }}
                >
                    No results found
                </Typography>
            )}
            {profileInfoOpen && (
                <ProfileInfo {...{ mode, otherUser, setProfileInfoOpen }} />
            )}
        </Box>
    );
};

export default SearchUser;
