import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuid } from 'uuid';

import storage from '../../../appwrite';
import { notifyAction } from '../../../actions/actions';

function CreateBlog() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState('');
    const [buttonStatus, setButtonStatus] = useState(!true);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [coverUrl, setCoverUrl] = useState(null);

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const handleImageChange = async (e) => {
        if (e.target.files[0]) {
            if (!e.target.files[0].type.match('image.*')) {
                alert('Please select an image');
                return;
            }
            setUploadStatus('Uploading...');
            const id = uuid();
            await storage.createFile(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                id,
                e.target.files[0]
            );

            const result = storage.getFilePreview(
                import.meta.env.VITE_APPWRITE_BUCKET_ID,
                id
            );
            setUploadStatus('Uploaded successfully ✅');
            setCoverUrl(result.href);
            setButtonStatus(false);
        }
    };

    const createNewPost = async (e) => {
        e.preventDefault();
        if (!title || !content || !summary) {
            alert('Please fill all the text fields');
            return;
        }
        if (!coverUrl) {
            alert('Please upload a cover image');
            return;
        }
        if (summary.length > 55) {
            alert('Summary should be less than 55 characters');
            return;
        }
        const auth = window.localStorage.getItem('healthApp');
        const { dnd } = JSON.parse(auth);
        const data = {
            title,
            summary,
            content,
            cover: coverUrl,
        };
        try {
            const response = await axios({
                method: 'POST',
                url: `${import.meta.env.VITE_SERVER_URL}/api/blog`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${dnd}`,
                },
                data,
            });
            dispatch(
                notifyAction(
                    true,
                    'success',
                    'Created a new Blog successfully!'
                )
            );
            navigate(`/blog/${response.data.result._id}`);
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
            sx={{
                overflowY: 'auto',
                mt: '75px',
                height: 'calc(100vh - 75px)',
                maxHeight: 'calc(100vh - 75px)',
                backgroundColor: 'background.paper',
                padding: '5rem',
                pt: 0,
            }}
        >
            <Paper
                sx={{
                    p: 2,
                    mt: 2,
                    backgroundColor: 'secondary.light',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.3)',
                    border: 'none',
                    borderRadius: '15px',
                }}
            >
                <Typography
                    variant='h3'
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        my: 2,
                        mb: 4,
                        color: 'secondary.contrastText',
                        padding: '0',
                        fontWeight: '600',
                        fontSize: '2.5rem',
                    }}
                >
                    <DriveFileRenameOutlineIcon
                        sx={{ fontSize: '2.5rem', mr: 1 }}
                    />
                    Create a Blog
                </Typography>
                <form onSubmit={createNewPost}>
                    <TextField
                        fullWidth
                        required
                        id='outlined-required'
                        label='Title'
                        value={title}
                        color='primary'
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{
                            backgroundColor: 'whitesmoke',
                            borderRadius: '6px',
                            mb: 3,
                            '& .MuiInputBase-input': {
                                p: 1,
                            },
                            '& .MuiInputLabel-root': {
                                top: -5,
                                fontSize: '0.9rem',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        required
                        id='outlined-required'
                        label='Summary (max 55 characters)'
                        value={summary}
                        color='primary'
                        onChange={(e) => setSummary(e.target.value)}
                        sx={{
                            backgroundColor: 'whitesmoke',
                            borderRadius: '6px',
                            mb: 3,
                            '& .MuiInputBase-input': {
                                p: 1,
                            },
                            '& .MuiInputLabel-root': {
                                top: -5,
                                fontSize: '0.9rem',
                            },
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            mb: 3,
                        }}
                    >
                        <label
                            htmlFor='cover'
                            style={{
                                fontSize: '1.1rem',
                                fontWeight: '500',
                            }}
                        >
                            Choose cover image -{' '}
                        </label>
                        <input
                            style={{
                                marginLeft: '5px',
                                padding: '7px',
                                backgroundColor: 'whitesmoke',
                                borderRadius: '6px',
                                border: `1px solid black`,
                            }}
                            title='cover'
                            placeholder='Cover'
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                        {uploadStatus && (
                            <Typography
                                variant='body1'
                                sx={{
                                    textAlign: 'center',
                                    ml: 1,
                                }}
                            >
                                {uploadStatus}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: 'whitesmoke',
                            mb: 3,
                            '& .ql-editor': {
                                minHeight: '200px',
                                fontSize: '1.1rem',
                            },
                        }}
                    >
                        <ReactQuill
                            theme='snow'
                            modules={modules}
                            value={content}
                            onChange={(newValue) => setContent(newValue)}
                        />
                    </Box>

                    <Button
                        color='primary'
                        variant='contained'
                        type='submit'
                        disabled={buttonStatus}
                        sx={{ borderRadius: '10px' }}
                    >
                        Create Post
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default CreateBlog;
