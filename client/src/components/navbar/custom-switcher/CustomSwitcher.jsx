import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

export const CustomSwitcherGroup = styled(ToggleButtonGroup)(() => ({
    backgroundColor: 'darkgreen',
    borderRadius: '50px',
    '& .MuiToggleButtonGroup-grouped': {
        margin: 0,
        border: 0,
        borderRadius: '50px',
        padding: '10px 15px',
        width: '150px',
        '&:not(:first-of-type)': {
            borderRadius: '50px',
            border: `6px solid darkgreen`,
        },
        '&:first-of-type': {
            borderRadius: '50px',
            border: `6px solid darkgreen`,
        },
    },
    '& .MuiToggleButton-root': {
        outline: 'none',
        borderRadius: '50px',
        backgroundColor: 'transparent',
        color: 'white',
        font: '600 0.8rem Poppins, sans-serif',

        '&:hover': {
            backgroundColor: 'success.main',
            color: 'black',
            transition: 'all 0.2s ease-in-out',
        },

        '&.Mui-selected': {
            backgroundColor: 'black',
            color: 'white',

            '&:hover': {
                backgroundColor: 'success.main',
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
