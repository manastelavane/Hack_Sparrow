import { useState } from 'react';
import {
    Box,
    Divider,
    Modal,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Send as SendIcon,
    Image as ImageIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

const MessageInput = ({
    handleSendMessage,
    inputRef,
    mode,
    uploadFile,
    textfieldOnChange,
}) => {
    const [imageModal, setImageModal] = useState(false);
    const [imgLocalURL, setImgLocalURL] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleImageInput = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const fileExt = file?.name.split('.').pop();
            if (
                fileExt === 'jpg' ||
                fileExt === 'jpeg' ||
                fileExt === 'png' ||
                fileExt === 'gif'
            ) {
                const localUrl = URL.createObjectURL(file);
                setImgLocalURL(localUrl);
                setImageFile(file);
                setImageModal(true);
                event.target.value = '';
            } else {
                alert(
                    'Please upload a valid image file of type jpg, jpeg, png or gif'
                );
            }
        }
    };

    const handleCloseImgModal = () => {
        setImageModal(false);
        setImgLocalURL('');
        setImageFile(null);
    };

    const handleSendImage = () => {
        if (!imageFile) {
            alert(
                'Please upload a valid image file of type jpg, jpeg, png or gif'
            );
            return;
        }
        uploadFile(imageFile);
        handleCloseImgModal();
    };

    const handleKey = (event) => {
        const text = inputRef?.current?.value;
        event.code === 'Enter' && event.ctrlKey && handleSendMessage(text);
    };

    const handleSendMsg = () => {
        const text = inputRef?.current?.value;
        handleSendMessage(text);
    };

    return (
        <Box
            sx={{
                position: 'sticky',
                bottom: '0',
            }}
        >
            <Modal
                open={imageModal}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '80%',
                        height: 'auto',
                        maxHeight: '460px',
                        backgroundColor: 'primary.dark',
                        boxShadow: 24,
                        borderRadius: '10px',
                        p: 2,
                        pb: 1,
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <CancelIcon
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'secondary.contrastText',
                        }}
                        cursor='pointer'
                        onClick={handleCloseImgModal}
                    />
                    <img
                        style={{
                            objectFit: 'contain',
                            height: '100%',
                            maxHeight: '400px',
                            display: 'block',
                        }}
                        alt='loading ...'
                        src={imgLocalURL}
                    />
                    <Divider sx={{ mt: '2px', width: '100%' }} />
                    <IconButton
                        onClick={handleSendImage}
                        sx={{ alignSelf: 'flex-end' }}
                    >
                        <Tooltip title='Send Image'>
                            <SendIcon
                                sx={{
                                    fontSize: '33px',
                                    // color: deepDark,
                                }}
                            />
                        </Tooltip>
                    </IconButton>
                </Box>
            </Modal>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    p: 1,
                }}
            >
                <TextField
                    inputRef={inputRef}
                    sx={{
                        width: '100%',
                        border: 'none',
                        '& .MuiOutlinedInput-root': {
                            backgroundColor:
                                mode === 'dark' ? '#101010' : '#f0f0f0',
                            paddingRight: '6px',
                            borderRadius: '20px',
                            fontFamily: 'Helvetica',
                            '&.Mui-focused fieldset': {
                                borderColor: 'secondary.main',
                            },
                        },
                    }}
                    color='success'
                    size='small'
                    multiline
                    maxRows={2}
                    placeholder='Hit Ctrl+Enter to send message'
                    autoFocus
                    onKeyDown={handleKey}
                    onChange={textfieldOnChange}
                />
                <input
                    accept='image/*'
                    id='sendImage'
                    type='file'
                    style={{ display: 'none' }}
                    onChange={handleImageInput}
                />
                <IconButton sx={{ ml: 1, pb: '4px' }}>
                    <label htmlFor='sendImage'>
                        <Tooltip title='Select an Image'>
                            <ImageIcon
                                sx={{
                                    fontSize: '33px',
                                    cursor: 'pointer',
                                    color: 'secondary.dark',
                                }}
                            />
                        </Tooltip>
                    </label>
                </IconButton>
                <IconButton onClick={handleSendMsg} sx={{ mr: '10px' }}>
                    <Tooltip title='Hit Ctrl + Enter to send'>
                        <SendIcon
                            sx={{
                                fontSize: '33px',
                                color: 'secondary.dark',
                            }}
                        />
                    </Tooltip>
                </IconButton>
            </Box>
        </Box>
    );
};

export default MessageInput;
