import { useState } from 'react';

// MUI imports
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, Button, Divider, Typography } from '@mui/material';

// React Router imports
import { useNavigate } from 'react-router-dom';

// Axios
import axios from 'axios';

// Redux
import { useDispatch } from 'react-redux';

// Actions
import {
    notifyAction,
    startLoadingAction,
    stopLoadingAction,
} from '../../../actions/actions';

// Components
import Mainheading from './Mainheading';
import Policy from './Policy';
import SubHeading from './SubHeading';

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
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '2rem 1.5rem',
                    my: '2rem',
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    border: `1px solid ${'primary.main'}`,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'Work Sans',
                        fontWeight: '600',
                        fontSize: '1.5rem',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <p>
                    At Unspecified Health App, we are committed to protecting
                    your privacy and ensuring the confidentiality of your
                    personal information. This Privacy Policy outlines how we
                    collect, use, and protect the information you provide to us
                    when using our digital platform.
                </p>
                    <br></br>
                </Typography>
            </Box>

            <Box
                sx={{
                    minWidth: 650,
                    backgroundColor: 'background.default',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                    borderRadius: '15px',
                    padding: '2rem',
                }}
            >
                <Mainheading>
                 Information We Collect
                </Mainheading>


                <SubHeading>
                Personal Information
                </SubHeading>


                <Policy>
                <p>
                    When you register on our platform, we may collect certain
                    personal information such as your name, email address, and
                    other contact details. This information is used to create
                    and manage your account and provide personalized services.{' '}
                </p>
                </Policy>

                <SubHeading>
                Usage Data
                </SubHeading>

                <Policy>
                <p>
                    We may collect information about how you interact with our
                    platform, including which groups you join, which blogs you write, which people You
                    have connected to and the results of your tests if you have taken any. This data helps us improve
                    our services and enhance your user experience.
                </p>
                </Policy>

                <Divider sx={{
                    my: '1rem',
                    backgroundColor: 'primary.main',
                }}/>

                <Mainheading>
                Use of Information
                </Mainheading>

                <Policy>                
                <p>
                    We use the information we collect to provide and improve our
                    services, personalize your experience, and communicate with
                    you about updates and new features. Your personal
                    information is kept confidential and is not shared with any
                    third parties without your consent, except as required by
                    law or to fulfill our legal obligations.
                    The information about your test results (as given in Take a Test) is used to 
                    recommend you blogs and groups that might be helpful for you.
                </p>
                </Policy>

                <Divider sx={{
                    my: '1rem',
                    backgroundColor: 'primary.main',
                }}/>
                
                <Mainheading>
                Data Security
                </Mainheading>
                <Policy>
                <p>
                    We implement industry-standard security measures to protect
                    your personal information from unauthorized access,
                    disclosure, or alteration. Sensitive data is encrypted and
                    stored securely, and access to this information is
                    restricted to authorized personnel only.
                </p>
                </Policy>

                <Divider sx={{
                    my: '1rem',
                    backgroundColor: 'primary.main',
                }}/>

                <Mainheading>
                Anonymous Usage
                </Mainheading>

                <Policy>
                <p>
                    We respect your right to privacy and offer options for
                    anonymous usage of our platform. You may choose to use
                    certain features anonymously, without providing any personal
                    information.
                </p>
                </Policy>

                <Divider sx={{
                    my: '1rem',
                    backgroundColor: 'primary.main',
                }}/>

                <Mainheading>
                Children&apos;s Privacy:
                </Mainheading>

                <Policy>
                <p>
                    Our platform is not intended for use by children under the
                    age of 13. We do not knowingly collect personal information
                    from children, and if we become aware of such information,
                    we will take appropriate steps to delete it.{' '}
                </p>
                </Policy>

                <Divider sx={{
                    my: '1rem',
                    backgroundColor: 'primary.main',
                }}/>

                <Mainheading>

                    Changes to Privacy Policy
                </Mainheading>

                <Policy>
                <p>
                    We reserve the right to update or modify this Privacy Policy
                    at any time. Any changes will be reflected on this page, and
                    we encourage you to review this policy periodically.{' '}
                </p>
                </Policy>

                <Divider sx={{
                    my: '1rem',
                    backgroundColor: 'primary.main',
                }}/>

    </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '2rem 1.5rem',
                        my: '2rem',
                        backgroundColor: 'primary.light',
                        color: 'primary.dark',
                        fontSize: '1.1rem',
                        borderRadius: '15px',
                        border: `1px solid ${'primary.main'}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: 'Work Sans',
                            fontWeight: '600',
                            fontSize: '1.5rem',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                            <p>
                            By using [Your App Name], you agree to the terms outlined in
                        this Privacy Policy. If you have any questions or concerns about
                        our privacy practices, please contact us at [contact email or
                        link].
                        </p>

                <p><Typography variant='overline' display='block' gutterBottom>
                    Last updated: [Date] [Your App Name] Team
                </Typography></p>


                    <br></br>   
                </Typography>


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
</Box>
    );
}
