import { useState } from 'react';

// MUI imports
import { Box, Button, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// React Router imports
import { useNavigate } from 'react-router-dom';

// Axios
import axios from 'axios';

// Redux
import { useDispatch } from 'react-redux';

// Actions
import {
    stopLoadingAction,
    startLoadingAction,
    notifyAction,
} from '../../../actions/actions';

export default function PrivacyPolicy() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleCheckboxChange = (e) => {
        setIsPrivacyAccepted(e.target.checked);
        setButtonDisabled(!e.target.checked);
    };

    // On submit, send the isPrivacyAccepted value to the server
    // to update the user's profile
    const handleSubmit = async () => {
        const auth = window.localStorage.getItem('healthApp');
        const { dnd } = JSON.parse(auth);
        try {
            dispatch(startLoadingAction());
            const data = {
                isPrivacyAccepted,
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
            dispatch(stopLoadingAction());

            if (result.data.success) {
                dispatch(notifyAction(result.data.message, 'success'));
                navigate('/groups');
            }
        } catch (error) {
            dispatch(stopLoadingAction());
            dispatch(notifyAction(error.response.data.message, 'error'));
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
                Privacy Policy
                <AdminPanelSettingsIcon
                    sx={{ fontSize: '3rem', marginLeft: '1rem' }}
                />
            </Typography>

            <Box
                sx={{
                    minWidth: 650,
                    backgroundColor: 'background.default',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                    borderRadius: '15px',
                    padding: '2rem',
                }}
            >
                <p>
                    At Unspecified Health App, we are committed to protecting
                    your privacy and ensuring the confidentiality of your
                    personal information. This Privacy Policy outlines how we
                    collect, use, and protect the information you provide to us
                    when using our digital platform.
                </p>
                <Typography variant='h2' component='h3'>
                    Information We Collect:
                </Typography>
                <Typography variant='h3' component='h4'>
                    Personal Information:
                </Typography>
                <p>
                    When you register on our platform, we may collect certain
                    personal information such as your name, email address, and
                    other contact details. This information is used to create
                    and manage your account and provide personalized services.{' '}
                </p>
                <Typography variant='h3' component='h4'>
                    Usage Data:
                </Typography>
                <p>
                    We may collect information about how you interact with our
                    platform, including your browsing activity, the pages you
                    visit, and the features you use. This data helps us improve
                    our services and enhance your user experience.
                </p>
                <Typography variant='h2' component='h3'>
                    Use of Information:
                </Typography>
                <p>
                    We use the information we collect to provide and improve our
                    services, personalize your experience, and communicate with
                    you about updates and new features. Your personal
                    information is kept confidential and is not shared with any
                    third parties without your consent, except as required by
                    law or to fulfill our legal obligations.
                </p>
                <Typography variant='h2' component='h3'>
                    Data Security:
                </Typography>
                <p>
                    We implement industry-standard security measures to protect
                    your personal information from unauthorized access,
                    disclosure, or alteration. Sensitive data is encrypted and
                    stored securely, and access to this information is
                    restricted to authorized personnel only.
                </p>
                <Typography variant='h2' component='h3'>
                    Anonymous Usage:
                </Typography>
                <p>
                    We respect your right to privacy and offer options for
                    anonymous usage of our platform. You may choose to use
                    certain features anonymously, without providing any personal
                    information. Third-Party Services: Our platform may
                    integrate with third-party services or tools to enhance
                    functionality. These third-party services are governed by
                    their own privacy policies, and we are not responsible for
                    their practices.
                </p>
                <Typography variant='h2' component='h3'>
                    Children&apos;s Privacy:
                </Typography>
                <p>
                    Our platform is not intended for use by children under the
                    age of 13. We do not knowingly collect personal information
                    from children, and if we become aware of such information,
                    we will take appropriate steps to delete it.{' '}
                </p>
                <Typography variant='h2' component='h3'>
                    Changes to Privacy Policy:
                </Typography>
                <p>
                    We reserve the right to update or modify this Privacy Policy
                    at any time. Any changes will be reflected on this page, and
                    we encourage you to review this policy periodically.{' '}
                </p>
                By using [Your App Name], you agree to the terms outlined in
                this Privacy Policy. If you have any questions or concerns about
                our privacy practices, please contact us at [contact email or
                link].
                <Typography variant='overline' display='block' gutterBottom>
                    Last updated: [Date] [Your App Name] Team
                </Typography>
            </Box>

            {/* Checkbox for accepting privacy */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: '2rem',
                }}
            >
                <input
                    type='checkbox'
                    id='privacy'
                    name='privacy'
                    onChange={handleCheckboxChange}
                />
                <label htmlFor='privacy'>
                    I have read and accept the Privacy Policy
                </label>

                <Button
                    variant='contained'
                    disabled={buttonDisabled}
                    sx={{ ml: 2 }}
                    onClick={handleSubmit}
                >
                    Continue
                </Button>
            </Box>
        </Box>
    );
}
