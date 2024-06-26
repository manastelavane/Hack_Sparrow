import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    TableRow,
} from '@mui/material';
import axios from 'axios';

import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

import { questions } from '../../../utils/questionTableData';

function QuestionTable() {
    const currentUser = useSelector((state) => state.auth);
    const [data, setData] = useState(null);
    const [selectedOption, setSelectedOption] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
        10: null,
        11: null,
        12: null,
        13: null,
        14: null,
        15: null,
        16: null,
        17: null,
        18: null,
        19: null,
        20: null,
        21: null,
        22: null,
        23: null,
        24: null,
        25: null,
    });

    ChartJS.register(
        RadialLinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
    );

    const chartOptions = {
        scales: {
            r: {
                max: 3,
                min: 0,
                ticks: {
                    stepSize: 0.5,
                },
            },
        },
    };

    const formSubmitHandler = async () => {
        const values = Object.values(selectedOption);
        if (values.includes(null)) {
            alert('Please answer all the questions');
            return;
        }
        let ocd = 0,
            adhd = 0,
            depression = 0,
            anxiety = 0,
            ptsd = 0;
        for (let i = 0; i < 25; i++) {
            if (questions[i].disorder === 'ocd') {
                ocd += selectedOption[i + 1];
            } else if (questions[i].disorder === 'ADHD') {
                adhd += selectedOption[i + 1];
            } else if (questions[i].disorder === 'depression') {
                depression += selectedOption[i + 1];
            } else if (questions[i].disorder === 'anxiety') {
                anxiety += selectedOption[i + 1];
            } else if (questions[i].disorder === 'PTSD') {
                ptsd += selectedOption[i + 1];
            }
        }
        console.log(ocd, adhd, depression, anxiety, ptsd);
        ocd = Math.round(ocd / 5);
        adhd = Math.round(adhd / 5);
        depression = Math.round(depression / 5);
        anxiety = Math.round(anxiety / 5);
        ptsd = Math.round(ptsd / 5);
        setData({
            labels: ['OCD', 'ADHD', 'Depression', 'Anxiety', 'PTSD'],
            datasets: [
                {
                    label: `${currentUser.username}'s Results`,
                    data: [ocd, adhd, depression, anxiety, ptsd],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)',
                },
            ],
        });
        console.log(ocd, adhd, depression, anxiety, ptsd);

        if (ocd === 0) ocd = 0;
        else if (ocd === 1) ocd = 25;
        else if (ocd === 2) ocd = 50;
        else if (ocd === 3) ocd = 75;
        else if (ocd === 4) ocd = 100;

        if (adhd === 0) adhd = 0;
        else if (adhd === 1) adhd = 25;
        else if (adhd === 2) adhd = 50;
        else if (adhd === 3) adhd = 75;
        else if (adhd === 4) adhd = 100;

        if (depression === 0) depression = 0;
        else if (depression === 1) depression = 25;
        else if (depression === 2) depression = 50;
        else if (depression === 3) depression = 75;
        else if (depression === 4) depression = 100;

        if (anxiety === 0) anxiety = 0;
        else if (anxiety === 1) anxiety = 25;
        else if (anxiety === 2) anxiety = 50;
        else if (anxiety === 3) anxiety = 75;
        else if (anxiety === 4) anxiety = 100;

        if (ptsd === 0) ptsd = 0;
        else if (ptsd === 1) ptsd = 25;
        else if (ptsd === 2) ptsd = 50;
        else if (ptsd === 3) ptsd = 75;
        else if (ptsd === 4) ptsd = 100;

        console.log(ocd, adhd, depression, anxiety, ptsd);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/user/test`,
                {
                    testScore: {
                        ocd,
                        adhd,
                        depression,
                        anxiety,
                        ptsd,
                    },
                    uid: currentUser.uid,
                }
            );
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        ocd = 0;
        adhd = 0;
        depression = 0;
        anxiety = 0;
        ptsd = 0;
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Table
                sx={{
                    minWidth: 650,
                    backgroundColor: 'background.default',
                    border: 'none',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                    borderRadius: '15px',
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell
                            sx={{
                                backgroundColor: 'primary.light',
                                borderRadius: '15px 0 0 0',
                                border: 'none',
                            }}
                        >
                            <Typography
                                variant='h4'
                                component='h4'
                                sx={{
                                    color: 'primary.dark',
                                    fontFamily: 'Work Sans',
                                    fontWeight: 'medium',
                                    fontSize: '1.3rem',
                                    padding: '1rem',
                                }}
                            >
                                Situations/Questions you may have experienced
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questions.map((question) => (
                        <TableRow key={question.id}>
                            <TableCell
                                sx={{
                                    color: 'secondary.main',
                                    border: 'none',
                                    boxShadow: 'none',
                                    borderRadius: 'none',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    p: 3,
                                    pb: 1,
                                }}
                                component='th'
                                scope='row'
                            >
                                <Typography
                                    variant='h4'
                                    component='h4'
                                    sx={{
                                        color: 'secondary.dark',
                                        m: '1rem',
                                        mt: '2px',
                                        mr: '2rem',
                                        fontFamily: 'Work Sans',
                                        fontWeight: 'medium',
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    {question.id}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography
                                        variant='h4'
                                        component='h5'
                                        sx={{
                                            color: 'secondary.main',
                                            fontFamily: 'Work Sans',
                                            fontWeight: 'medium',
                                            fontSize: '1.1rem',
                                            textAlign: 'left',
                                        }}
                                    >
                                        {question.question}
                                    </Typography>
                                    <RadioGroup
                                        row
                                        sx={{
                                            mb: '1.3rem',
                                        }}
                                        aria-label={question.id}
                                        name={question.id.toString()}
                                        value={selectedOption[question.id]}
                                        onChange={(e) =>
                                            setSelectedOption({
                                                ...selectedOption,
                                                [question.id]: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    >
                                        <FormControlLabel
                                            sx={{
                                                mr: '2rem',
                                            }}
                                            value={0}
                                            label='Not at all'
                                            control={<Radio color='primary' />}
                                        />
                                        <FormControlLabel
                                            sx={{
                                                mr: '2rem',
                                            }}
                                            value={1}
                                            control={<Radio color='success' />}
                                            label='Some of the days'
                                        />
                                        <FormControlLabel
                                            sx={{
                                                mr: '2rem',
                                            }}
                                            value={2}
                                            label='Most of the days'
                                            control={<Radio color='success' />}
                                        />
                                        <FormControlLabel
                                            value={3}
                                            label='Nearly every day'
                                            control={<Radio color='success' />}
                                        />
                                    </RadioGroup>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                color='secondary'
                variant='contained'
                sx={{
                    p: 1,
                    px: 4,
                    mt: 3,
                    font: '500 1.2rem Poppins, sans-serif',
                    borderRadius: '15px',
                    textTransform: 'none',
                }}
                onClick={formSubmitHandler}
            >
                Give me my results!
            </Button>
            {data && (
                <Box
                    sx={{
                        backgroundColor: 'primary.light',
                        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                        mt: 3,
                        p: '2rem',
                        borderRadius: '15px',
                        border: 'black',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Box>
                        <Typography
                            variant='h2'
                            component='h3'
                            sx={{
                                mb: '1rem',
                                color: 'primary.contrastText',
                                fontWeight: '600',
                                fontSize: '2rem',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'left',
                            }}
                        >
                            Results
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: 'azure',
                            borderRadius: '15px',
                            border: 'black',
                            display: 'grid',
                            placeItems: 'center',
                            height: '450px',
                            padding: '1rem',
                        }}
                    >
                        <Radar
                            options={chartOptions}
                            data={data}
                            redraw={true}
                        />
                    </Box>
                    <Box
                        sx={{
                            mt: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                font: '400 1.1rem Work Sans, sans-serif',
                                color: 'primary.contrastText',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'left',
                            }}
                        >
                            The radar chart you see represents your scores in
                            different areas of mental health disorders. Each
                            point on the chart represents a score on a scale of
                            0-3, with 0 indicating no symptoms and 3 indicating
                            severe symptoms.
                            <br />
                            <br />
                            Please note that this chart is not a substitute for
                            professional medical advice and should not be used
                            to diagnose or treat any condition. If you have any
                            concerns about your mental health, we strongly
                            recommend that you speak with a healthcare
                            professional.
                            <br />
                            <br />
                            You can share this chart with people you trust, but
                            it&apos;s not intended to be used as a diagnostic
                            tool.
                        </Typography>
                    </Box>
                </Box>
            )}
        </div>
    );
}

export default QuestionTable;
