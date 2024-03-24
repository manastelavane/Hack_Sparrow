import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Stack } from '@mui/material';

// import { otherUser } from './Connect';

const ProfileInfo = ({ otherUser, setProfileInfoOpen }) => {
    console.log(otherUser);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: 600,
                maxHeight: '700px',
                backgroundColor: 'primary.main',
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
                        fontWeight: 'bold',
                    }}
                >
                    Profile
                </Typography>
                <IconButton onClick={() => setProfileInfoOpen(false)}>
                    <CloseIcon
                        sx={
                            {
                                // color: mode === 'light' ? deepDark : light,
                            }
                        }
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
                        alt={otherUser?.username.charAt(0).toUpperCase()}
                        src={otherUser?.photoURL}
                        sx={{
                            height: 150,
                            width: 150,
                            border: '2px solid',
                            top: 0,
                        }}
                    >
                        {otherUser?.username.charAt(0).toUpperCase()}
                    </Avatar>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                    }}
                >
                    <Stack spacing={2}>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='subtitle1'>Bio -</Typography>
                            <Chip
                                label={otherUser?.bio ? otherUser?.bio : 'None'}
                                color='success'
                                size='medium'
                            />
                        </Stack>
                        <Stack direction='row' alignItems='center' spacing={1}>
                            <Typography variant='subtitle1'>
                                Username -
                            </Typography>
                            <Chip
                                label={
                                    otherUser?.username
                                        ? otherUser?.username
                                        : 'Hidden'
                                }
                                color='success'
                                size='medium'
                            />
                        </Stack>
                    </Stack>
                </Box>
            </Box>
            {(otherUser?.socialLinks?.twitter !== '' ||
                otherUser?.socialLinks?.instagram !== '') && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '100%',
                        mb: 2,
                    }}
                >
                    <TwitterIcon
                        sx={{
                            // color: mode === 'light' ? deepDark : light,
                            fontSize: '2rem',
                            mr: 2,
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            window.open(
                                otherUser?.socialLinks?.twitter,
                                '_blank'
                            );
                        }}
                    />
                    <InstagramIcon
                        sx={{
                            // color: mode === 'light' ? deepDark : light,
                            fontSize: '2rem',
                            mr: 1,
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            window.open(
                                otherUser?.socialLinks?.instagram,
                                '_blank'
                            );
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ProfileInfo;
