import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ModeIcon from '@mui/icons-material/Mode';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

import QuestionTable from './QuestionTable';

function Exam() {
    const currentUser = useSelector((state) => state.auth);

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
                Take a Test!
                <ModeIcon sx={{ fontSize: '3rem', marginLeft: '1rem' }} />
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
                Hey {currentUser.username}, You are not alone :)
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '2rem',
                    my: '2rem',
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    border: `1px solid ${'primary.main'}`,
                }}
            >
                <Typography
                    variant='h2'
                    component='h3'
                    sx={{
                        mb: '1rem',
                        fontWeight: 'medium',
                        fontSize: '2rem',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <PsychologyAltIcon
                        sx={{
                            height: '2.5rem',
                            width: '2.5rem',
                            mr: 1,
                        }}
                    ></PsychologyAltIcon>{' '}
                    How it Works ?
                </Typography>
                <Typography
                    sx={{
                        fontFamily: 'Work Sans',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    Online screening tools are meant to be a quick snapshot of
                    your mental health. If your results indicate you may be
                    experiencing symptoms of a mental illness, consider sharing
                    your results with someone you trust. We can only provide you
                    some simple assessments, A mental health provider (such as a
                    doctor or a therapist) can give you a full assessment and
                    talk to you about options for how to feel better.
                    <br></br>
                </Typography>
            </Box>
            <Box>
                <QuestionTable />
            </Box>
        </Box>
    );
}

export default Exam;
