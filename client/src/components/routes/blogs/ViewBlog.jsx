import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useSpeechSynthesis } from 'react-speech-kit'; // Import the hook

import {
    notifyAction,
    startLoadingAction,
    stopLoadingAction,
} from '../../../actions/actions';
import {
    VolumeUp as VolumeUpIcon,
    Block as BlockIcon,
} from '@mui/icons-material';

function ViewBlog() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const blogId = params.id;
    const author = useSelector((state) => state.auth);
    const [blog, setBlog] = useState(null);
    const { speak, speaking, cancel } = useSpeechSynthesis();

    useEffect(() => {
        const fetchBlog = async () => {
            dispatch(startLoadingAction(true));
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/blog/${blogId}`
                );
                setBlog(data.result);
            } catch (error) {
                console.log(error);
                dispatch(
                    notifyAction(
                        true,
                        'error',
                        'Unable to load the blog, please try again later.'
                    )
                );
                console.log(error);
            }
            dispatch(stopLoadingAction());
        };
        fetchBlog();
    }, [blogId, dispatch]);

    const deleteBlog = async () => {
        const choice = window.confirm('Are you sure you want to delete?');
        if (!choice) return;
        const auth = window.localStorage.getItem('healthApp');
        const { dnd } = JSON.parse(auth);
        dispatch(startLoadingAction());
        try {
            await axios({
                method: 'DELETE',
                url: `${
                    import.meta.env.VITE_SERVER_URL
                }/api/blog/delete/${blogId}`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${dnd}`,
                },
            });
            dispatch(
                notifyAction(true, 'success', 'Blog deleted successfully!')
            );
            navigate('/blogs');
        } catch (error) {
            console.log(error);
            dispatch(
                notifyAction(
                    true,
                    'error',
                    'Sorry :( but something went wrong!'
                )
            );
        }
        dispatch(stopLoadingAction());
    };

    const editBlog = () => {
        navigate(`/editBlog/${blogId}`, {
            state: {
                blog,
            },
        });
    };

    // Function to read the blog content aloud and highlight each word as it is read
    const toggleReadBlog = () => {
        if (speaking) {
            // If currently speaking, stop reading
            cancel();
        } else {
            // If not speaking, start reading
            speak({
                text:
                    blog?.title +
                    ' by ' +
                    blog?.authorName +
                    ' on ' +
                    blog?.createdAt.split('T')[0] +
                    ' ' +
                    blog?.content,
            });
        }
    };
    return (
        <Box
            sx={{
                overflowY: 'auto',
                mt: '75px',
                height: 'calc(100vh - 75px)',
                maxHeight: 'calc(100vh - 75px)',
                backgroundColor: 'background.default',
                padding: '5rem',
                pt: 2,
            }}
        >
            <Card>
                <CardMedia component='img' height='350px' image={blog?.cover} />
                <CardContent
                    sx={{
                        p: 4,
                    }}
                >
                    <Button
                        onClick={toggleReadBlog}
                        variant='outlined'
                        sx={{
                            marginBottom: '1rem',
                        }}
                        endIcon={!speaking ? <VolumeUpIcon /> : <BlockIcon />}
                    >
                        {speaking ? 'Stop Reading' : 'Read Blog'}
                    </Button>
                    <Typography
                        sx={{ textAlign: 'center' }}
                        gutterBottom
                        variant='h3'
                        component='div'
                    >
                        {blog?.title}
                    </Typography>
                    {blog && (
                        <Typography
                            variant='subtitle1'
                            color='textSecondary'
                            sx={{
                                mb: 2,
                                textAlign: 'center',
                            }}
                        >
                            by{' '}
                            {`${blog?.authorName}  on   ${
                                blog?.createdAt.split('T')[0]
                            }`}
                        </Typography>
                    )}
                    <div
                        className='content'
                        style={{ wordBreak: 'break-word' }}
                    >
                        {/* Render each paragraph separately */}
                        {blog?.content.split('</p>').map((paragraph, index) => (
                            <p
                                key={index}
                                dangerouslySetInnerHTML={{ __html: paragraph }}
                                style={{
                                    backgroundColor: 'transparent',
                                }}
                            />
                        ))}
                    </div>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3 }}>
                    <Stack direction='row' spacing={1}>
                        <IconButton
                            onClick={() =>
                                window.open(
                                    `https://web.whatsapp.com/send?text=Heres the blog link ${window.location.href}`,
                                    '_blank'
                                )
                            }
                            color='success'
                            aria-label='WhatsAppIcon'
                        >
                            <WhatsAppIcon />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                window.open(
                                    `mailto:?body=Heres%the%blog%link%${window.location.href}`,
                                    '_blank'
                                )
                            }
                            aria-label='EmailIcon'
                            color='primary'
                        >
                            <EmailIcon />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                window.open(
                                    `https://twitter.com/intent/tweet/?url=${window.location.href}&text=Heres the blog link-`,
                                    '_blank'
                                )
                            }
                            color='primary'
                            aria-label='TwitterIcon'
                        >
                            <TwitterIcon />
                        </IconButton>
                    </Stack>
                    {blog?.authorId === author.uid && (
                        <>
                            <Button
                                variant='contained'
                                disableElevation
                                color='error'
                                onClick={deleteBlog}
                                size='small'
                                sx={{
                                    p: '6px',
                                    mx: '1rem',
                                    font: '500 0.9rem Poppins, sans-serif',
                                }}
                            >
                                Delete
                            </Button>
                            <Button
                                color='success'
                                disableElevation
                                onClick={editBlog}
                                sx={{
                                    backgroundColor: 'success.main',
                                    color: 'white',
                                    font: '500 0.9rem Poppins, sans-serif',
                                    ':hover': {
                                        backgroundColor: 'success.dark',
                                        color: 'black',
                                    },
                                }}
                                variant='contained'
                            >
                                Edit Blog
                            </Button>
                        </>
                    )}
                </CardActions>
            </Card>
        </Box>
    );
}

export default ViewBlog;
