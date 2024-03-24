import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import ReportIcon from '@mui/icons-material/Report';
import {
    useHMSActions,
    useHMSStore,
    selectIsPeerAudioEnabled,
    selectLocalPeer,
} from '@100mslive/hms-video-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { notifyAction } from '../../../actions/actions';

const PeerInRoom = ({ peer, report, setReport, localCustomerUserId }) => {
    const dispatch = useDispatch();
    const hmsActions = useHMSActions();
    const audioEnabled = useHMSStore(selectIsPeerAudioEnabled(peer.id));
    const localPeer = useHMSStore(selectLocalPeer);
    const isModerator = localPeer.roleName === 'moderator';

    const [anchorEl, setAnchorEl] = useState(null);

    const mutePeer = () => {
        if (isModerator) {
            const audioTrack = peer.audioTrack || '';
            hmsActions.setRemoteTrackEnabled(audioTrack, false);
        }
    };

    const changeRole = (role) => {
        hmsActions.changeRoleOfPeer(peer.id, role, true);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const onReport = async () => {
        const index = report.findIndex((r) => r.id === peer.id);
        const temp = [...report];
        if (temp[index].report === 1) return;
        temp[index].report = 1;
        const auth = window.localStorage.getItem('healthApp');
        const { dnd } = JSON.parse(auth);

        const data = {
            reportedByUser: localCustomerUserId,
            reportedTo: localPeer.customerUserId,
        };
        try {
            await axios({
                method: 'PATCH',
                url: `${import.meta.env.VITE_SERVER_URL}/api/user/report`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${dnd}`,
                },
                data,
            });
            setReport(temp);
            dispatch(
                notifyAction(true, 'success', 'Reported User Successfully')
            );
        } catch (error) {
            console.log(error);
            dispatch(
                notifyAction(
                    true,
                    'error',
                    error.response.data.message ||
                        'It seems something is wrong, please log out and log in again. later :('
                )
            );
        }
    };
    return (
        <Box
            key={peer.id}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'secondary.main',
                padding: '0.9rem',
                px: '3.5rem',
                py: '3rem',
                borderRadius: '10px',
                position: 'relative',
                width: '100%',
            }}
        >
            {isModerator ? (
                <>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: '6px',
                            right: '44px',
                        }}
                        onClick={onReport}
                    >
                        {
                            //check if user is already reported, else if myself then show nothing
                            report.find((r) => r.id === peer.id)?.report ===
                            0 ? (
                                <ReportGmailerrorredIcon />
                            ) : localPeer.id === peer.id ? null : (
                                <ReportIcon />
                            )
                        }
                    </IconButton>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: '6px',
                            right: '8px',
                        }}
                        onClick={handleMenuClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                // backgroundColor:
                                //     mode === 'light' ? light : bluegrey,
                            },
                        }}
                    >
                        {audioEnabled ? (
                            <Tooltip
                                placement='top'
                                title={`Mute ${peer.name.split('@')[0]}`}
                            >
                                <MenuItem onClick={mutePeer}>
                                    <MicIcon />
                                    <ListItemText
                                        sx={{ ml: 1 }}
                                        primary='Unmuted'
                                    />
                                </MenuItem>
                            </Tooltip>
                        ) : (
                            <Tooltip
                                placement='top'
                                title={`User cannot be unmuted`}
                            >
                                <MenuItem>
                                    <MicOffIcon />
                                    <ListItemText
                                        sx={{ ml: 1 }}
                                        primary='Muted'
                                    />
                                </MenuItem>
                            </Tooltip>
                        )}
                        {peer.roleName === 'participant' ? (
                            <Tooltip
                                title={`Make ${
                                    peer.name.split('@')[0]
                                } a moderator`}
                            >
                                <MenuItem
                                    onClick={() => changeRole('moderator')}
                                >
                                    <AddModeratorIcon />
                                    <ListItemText
                                        sx={{ ml: 1 }}
                                        primary='Make Moderator'
                                    />
                                </MenuItem>
                            </Tooltip>
                        ) : (
                            <Tooltip
                                title={`Make ${
                                    peer.name.split('@')[0]
                                } a participant`}
                            >
                                <MenuItem
                                    onClick={() => changeRole('participant')}
                                >
                                    <RemoveModeratorIcon />
                                    <ListItemText
                                        sx={{ ml: 1 }}
                                        primary='Make Participant'
                                    />
                                </MenuItem>
                            </Tooltip>
                        )}
                    </Menu>
                </>
            ) : (
                !audioEnabled && (
                    <>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: '2px',
                                right: '44px',
                            }}
                            onClick={onReport}
                        >
                            {
                                //check if user is already reported, else if myself then show nothing
                                report.find((r) => r.id === peer.id)?.report ===
                                0 ? (
                                    <ReportGmailerrorredIcon />
                                ) : localPeer.id === peer.id ? null : (
                                    <ReportIcon />
                                )
                            }
                        </IconButton>
                        <MicOffIcon
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                right: '8px',
                            }}
                        />
                    </>
                )
            )}
            <Tooltip title={peer.name.split('@')[0]}>
                <Avatar
                    alt={peer.name.charAt(0).toUpperCase()}
                    src={peer.name.split('@')[1]}
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: '#25D366',
                        color: 'white',
                        fontSize: '2.5rem',
                    }}
                >
                    {peer.name.charAt(0).toUpperCase()}
                </Avatar>
            </Tooltip>

            <Typography
                sx={{
                    fontSize: '1.8rem',
                    mt: '0.9rem',
                    // color: mode === 'light' ? deepDark : light,
                    position: 'absolute',
                    top: '70%',
                }}
            >
                {peer.name.split('@')[0]}
            </Typography>
            <Typography
                sx={{
                    fontSize: '1rem',
                    // color: mode === 'light' ? deepDark : light,
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                }}
            >
                {peer?.roleName
                    ? peer.roleName.charAt(0).toUpperCase() +
                      peer.roleName.slice(1)
                    : ''}
                {/* {peer.name.split('@')[0]} */}
            </Typography>
        </Box>
    );
};

export default PeerInRoom;
