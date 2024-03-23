import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { notifyAction } from '../../../actions/actions';

function EditBlog() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const blog = location.state.blog;

    const oldTitle = blog.title;
    const oldContent = blog.content;
    const oldSummary = blog.summary;
    const [title, setTitle] = useState(blog.title);
    const [content, setContent] = useState(blog.content);
    const [summary, setSummary] = useState(blog.summary);

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

    const editPost = async (e) => {
        e.preventDefault();
        if (!title || !content || !summary) {
            alert('Please fill all the text fields');
            return;
        }
        if (
            title === oldTitle &&
            content === oldContent &&
            summary === oldSummary
        ) {
            alert('No changes made');
            return;
        }
        const auth = window.localStorage.getItem('healthApp');
        const { dnd } = JSON.parse(auth);
        const data = {
            title,
            content,
            summary,
        };
        try {
            await axios({
                method: 'PATCH',
                url: `${import.meta.env.VITE_SERVER_URL}/api/blog/edit/${
                    blog._id
                }`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${dnd}`,
                },
                data,
            });
            navigate(`/blog/${blog._id}`);
            dispatch(
                notifyAction(true, 'success', 'Blog edited successfully!')
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
            sx={{
                overflowY: 'auto',
                mt: '75px',
                maxHeight: 'calc(100vh - 75px)',
                backgroundColor: 'secondary.main',
                padding: '5rem',
                pt: 2,
            }}
        >
            <Paper
                sx={{
                    p: 2,
                    mt: 2,
                    backgroundColor: 'secondary.light',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
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
                        color: 'primary.main',
                        padding: '0',
                        fontWeight: '600',
                        fontSize: '2.5rem',
                    }}
                >
                    <DriveFileRenameOutlineIcon
                        sx={{ fontSize: '2.5rem', mr: 1 }}
                    />
                    Edit blog
                </Typography>
                <form onSubmit={editPost}>
                    <TextField
                        fullWidth
                        required
                        id='outlined-required'
                        label='Title'
                        value={title}
                        color='success'
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
                        color='success'
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
                    <ReactQuill
                        theme='snow'
                        modules={modules}
                        value={content}
                        onChange={(newValue) => setContent(newValue)}
                        sx={{
                            backgroundColor: 'paper',
                            borderRadius: '6px',
                            mb: 3,
                            '& .ql-editor': {
                                p: 1,
                            },
                            '& .ql-container': {
                                p: 1,
                            },
                        }}
                    />

                    <Button
                        color='success'
                        sx={{
                            mt: 3,
                            backgroundColor: 'success.main',
                            color: 'white',
                            font: '500 0.9rem Poppins, sans-serif',
                            ':hover': {
                                backgroundColor: 'success.dark',
                                color: 'black',
                            },
                        }}
                        variant='contained'
                        type='submit'
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default EditBlog;
