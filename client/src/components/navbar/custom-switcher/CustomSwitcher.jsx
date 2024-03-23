import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

export const CustomSwitcherGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '50px',
    '& .MuiToggleButtonGroup-grouped': {
        margin: 0,
        border: 0,
        borderRadius: '50px',
        padding: '10px 15px',
        width: '150px',
        '&:not(:first-of-type)': {
            borderRadius: '50px',
            border: `6px solid`,
            borderColor: theme.palette.secondary.main,
        },
        '&:first-of-type': {
            borderRadius: '50px',
            border: `6px solid`,
            borderColor: theme.palette.secondary.main,
        },
    },
    '& .MuiToggleButton-root': {
        outline: 'none',
        borderRadius: '50px',
        backgroundColor: theme.palette.primary.light,
        color: 'black',
        font: '600 0.8rem Poppins, sans-serif',

        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: 'black',
            transition: 'all 0.2s ease-in-out',
        },

        '&.Mui-selected': {
            backgroundColor: theme.palette.secondary.dark,
            color: 'white',

            '&:hover': {
                backgroundColor: theme.palette.secondary.light,
                color: 'white',
            },
        },
    },
}));

export const CustomSwitcherButton = styled(ToggleButton)(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
}));
