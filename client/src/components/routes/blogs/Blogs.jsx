import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { notifyAction } from '../../../actions/actions';

function Blogs() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const observer = useRef();
    const [blogs, setBlogs] = useState(null);
    const [pageNum, setPageNum] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState(1);
    const currentUser = useSelector((state) => state.auth);

    const handleChange = (event) => {
        if (event.target.value !== filter) {
            setBlogs(null);
            setPageNum(0);
        }
        setFilter(event.target.value);
    };

    useEffect(() => {
        const getBlogs = async () => {
            try {
                setLoading(true);
                const blogsFromServer = await axios.get(
                    `${
                        import.meta.env.VITE_SERVER_URL
                    }/api/blog?page=${pageNum}&filter=${filter}&uid=${
                        currentUser.uid
                    }`
                );
                setBlogs((prev) => {
                    if (!prev || prev.length === 0) {
                        return blogsFromServer.data.result;
                    } else {
                        return [...prev, ...blogsFromServer.data.result];
                    }
                });
                if (blogsFromServer?.data?.result?.length < 6) {
                    setHasMore(false);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
                dispatch(
                    notifyAction(
                        true,
                        'error',
                        'Unable to load blogs! Please try again later.'
                    )
                );
                console.log(err);
            }
        };
        getBlogs();
    }, [dispatch, pageNum, filter]);

    const handleClick = (id) => {
        navigate(`/blog/${id}`);
    };

    const lastBlogRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNum((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

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
            <Typography
                variant='h1'
                component='h2'
                sx={{
                    color: 'secondary.main',
                    margin: '2rem',
                    fontWeight: 'bold',
                    fontSize: '3rem',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                Read Blogs
                <ChromeReaderModeIcon
                    sx={{ fontSize: '3rem', marginLeft: '1rem' }}
                />
            </Typography>

            <Typography
                variant='h2'
                component='h3'
                sx={{
                    color: 'secondary.dark',
                    margin: '2rem',
                    fontFamily: 'Work Sans',
                    fontWeight: 'medium',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                You can share your experience or read others&apos; experiences
                here.
            </Typography>

            <Box sx={{ minWidth: 120, mb: 4 }}>
                <FormControl>
                    <InputLabel id='demo-simple-select-label'>
                        Filter
                    </InputLabel>
                    <Select
                        id='demo-simple-select'
                        value={filter}
                        label='Filter'
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>Latest</MenuItem>
                        <MenuItem value={2}>Recommended</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridGap: '2rem',
                }}
            >
                {blogs &&
                    blogs.map((blog, index) => {
                        return blogs.length === index + 1 ? (
                            <Card
                                ref={lastBlogRef}
                                key={blog._id}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    borderRadius: '10px',
                                    border: 'none',
                                    width: '100%',
                                    maxHeight: '420px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleClick(blog._id)}
                            >
                                <CardMedia
                                    component='img'
                                    height='270px'
                                    image={blog.cover}
                                />
                                <CardContent
                                    sx={{
                                        flex: '1',
                                    }}
                                >
                                    <Typography variant='h5'>
                                        {blog.title}
                                    </Typography>
                                    <Typography
                                        variant='subtitle2'
                                        color='textSecondary'
                                        sx={{
                                            mb: 1,
                                        }}
                                    >
                                        by{' '}
                                        {`${blog.authorUsername}  on   ${
                                            blog.createdAt.split('T')[0]
                                        }`}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ wordBreak: 'breakWord' }}
                                    >
                                        {blog.summary}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card
                                key={blog._id}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    borderRadius: '10px',
                                    border: 'none',
                                    width: '100%',
                                    maxHeight: '420px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleClick(blog._id)}
                            >
                                <CardMedia
                                    component='img'
                                    height='270px'
                                    image={blog.cover}
                                />
                                <CardContent
                                    sx={{
                                        flex: '1',
                                    }}
                                >
                                    <Typography variant='h5'>
                                        {blog.title}
                                    </Typography>
                                    <Typography
                                        variant='subtitle2'
                                        color='textSecondary'
                                        sx={{
                                            mb: 1,
                                        }}
                                    >
                                        by{' '}
                                        {`${blog.authorUsername}  on   ${
                                            blog.createdAt.split('T')[0]
                                        }`}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{ wordBreak: 'breakWord' }}
                                    >
                                        {blog.summary}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
            </Box>
            {loading && (
                <img
                    style={{ alignSelf: 'center', width: '200px' }}
                    src='/assets/vectors/load-more.svg'
                    alt=''
                />
            )}
            <Tooltip title='Create a new Blog'>
                <Fab
                    color='secondary'
                    aria-label='add'
                    sx={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',

                        borderRadius: '50%',
                        height: '3.5rem',
                        width: '3.5rem',

                        display: 'grid',
                        placeItems: 'center',
                        cursor: 'pointer',

                        boxShadow: '0 0 10px 0 rgba(78,135,140, 0.3)',

                        '&:hover': {
                            transform: 'scale(1.1) rotate(90deg)',
                            transition: 'transform 0.2s ease-in-out',
                        },
                    }}
                    onClick={() => navigate('/createBlog')}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
        </Box>
    );
}

export default Blogs;
