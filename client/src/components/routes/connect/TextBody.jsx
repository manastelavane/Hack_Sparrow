import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';

import { formatTime12 } from '../../../utils/formatTimestamp';

const TextBody = ({ message, endRef }) => {
    const currentUser = useSelector((state) => state.auth);

    const [messageTime, setMessageTime] = useState('');
    const [isLink, setIsLink] = useState(false);
    const [isImage, setIsImage] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [imageURL, setImageURL] = useState('');

    const urlRegex =
        /([a-zA-Z0-9]+:\/\/)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\.[A-Za-z]{2,4})(:[0-9]+)?(\/.*)?/;

    const splitUrlRegex =
        /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

    const imageRegex =
        /(https:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg|.webp|.jpeg|.gif|\/preview\?project=|\/view\?project=)(\?[^\s[",><]*)?/gi;

    useEffect(() => {
        const time = formatTime12(message.timestamp / 1000);
        setMessageTime(time);
        setIsImage(imageRegex.test(message.text));
        setIsLink(urlRegex.test(message.text));
    }, [message]);

    const funcSplitMessage = (message) => {
        let splitMessage = message.split(splitUrlRegex);

        if (splitMessage.length === 1) {
            splitMessage = message.split(urlRegex);
        }

        splitMessage = splitMessage.filter((item) => {
            return (
                item !== '' &&
                item !== undefined &&
                item !== 'https' &&
                item !== 'http'
            );
        });
        return splitMessage;
    };

    const handleImgModal = (event) => {
        if (imageModal) {
            setImageModal(false);
            setImageURL('');
        } else {
            const src = event.target.src;
            setImageModal(true);
            setImageURL(src);
        }
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    borderRadius: '20px',
                    maxWidth: '30rem',
                    width: 'fit-content',
                    p: '12px',
                    color: 'white',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'end',
                    ...(currentUser.uid === message.senderId
                        ? {
                              alignSelf: 'flex-end',
                              borderBottomLeftRadius: '20px',
                              borderBottomRightRadius: '1px',
                              backgroundColor: 'primary.dark',
                          }
                        : {
                              backgroundColor: 'secondary.dark',
                              borderBottomLeftRadius: '2px',
                          }),
                    ...(isImage
                        ? {
                              flexDirection: 'column',
                          }
                        : {
                              flexDirection: 'row',
                          }),
                }}
            >
                <Modal
                    open={imageModal}
                    onClose={handleImgModal}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 'auto',
                            maxWidth: '80%',
                            height: 'auto',
                            maxHeight: '460px',
                            backgroundColor: 'primary.dark',
                            boxShadow: 24,
                            borderRadius: '10px',
                            p: 2,
                            border: 'none',
                            display: 'flex',
                            justifyContent: 'center',
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
                            onClick={handleImgModal}
                        />
                        <img
                            style={{
                                objectFit: 'contain',
                                height: '100%',
                                maxHeight: '400px',
                                display: 'block',
                            }}
                            alt='Failed to load :('
                            src={imageURL}
                        />
                        <a
                            style={{ color: 'white' }}
                            href={imageURL}
                            target='_blank'
                            rel='noreferrer'
                        >
                            Open Original
                        </a>
                    </Box>
                </Modal>
                {isLink ? (
                    <Box sx={{ wordBreak: 'break-word' }}>
                        {funcSplitMessage(message.text).map((item, index) => {
                            if (urlRegex.test(item)) {
                                let src = item;
                                if (!item.includes('https://')) {
                                    src = 'https://' + item;
                                }
                                if (isImage) {
                                    return (
                                        <img
                                            onClick={handleImgModal}
                                            key={index}
                                            src={src}
                                            alt={src}
                                            loading='lazy'
                                            style={{
                                                width: '100%',
                                                minWidth: '100px',
                                                maxHeight: '250px',
                                                borderRadius: '10px',
                                                objectFit: 'contain',
                                                cursor: 'pointer',
                                                minHeight: '50px',
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <Link
                                            key={index}
                                            href={src}
                                            target={
                                                item.includes(
                                                    'comfortspace.netlify.app'
                                                )
                                                    ? '_self'
                                                    : '_blank'
                                            }
                                            rel={
                                                item.includes(
                                                    'comfortspace.netlify.app'
                                                )
                                                    ? ''
                                                    : 'noopener noreferrer'
                                            }
                                            sx={{
                                                fontFamily: 'Helvetica',
                                                color: 'inherit',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            {item}
                                        </Link>
                                    );
                                }
                            } else {
                                return (
                                    <Typography
                                        sx={{
                                            fontFamily: 'Helvetica',
                                        }}
                                        key={index}
                                    >
                                        {item}
                                    </Typography>
                                );
                            }
                        })}
                    </Box>
                ) : (
                    <Typography
                        sx={{
                            wordBreak: 'break-word',
                            fontFamily: 'Helvetica',
                        }}
                    >
                        {message.text}
                    </Typography>
                )}
                <Typography
                    ref={endRef}
                    sx={{
                        textAlign: 'right',
                        fontSize: '11px',
                        fontFamily: 'Helvetica',
                        ml: '4px',
                        mb: '-5px',
                        alignSelf: 'flex-end',
                        ...(currentUser.uid !== message.senderId && {
                            color: 'background.paper',
                        }),
                    }}
                >
                    {messageTime}
                </Typography>
            </Box>
        </React.Fragment>
    );
};

export default TextBody;
