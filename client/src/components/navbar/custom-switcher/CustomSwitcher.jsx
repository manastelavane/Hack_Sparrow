import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

export const CustomSwitcherGroup = styled(ToggleButtonGroup)(() => ({
    backgroundColor: 'primary.main',
    borderRadius: '50px',
    '& .MuiToggleButtonGroup-grouped': {
        margin: 0,
        border: 0,
        borderRadius: '50px',
        padding: '10px 15px',
        width: '150px',
        '&:not(:first-of-type)': {
            borderRadius: '50px',
            border: `6px solid primary.main`,
        },
        '&:first-of-type': {
            borderRadius: '50px',
            border: `6px solid primary.main`,
        },
    },
    '& .MuiToggleButton-root': {
        outline: 'none',
        borderRadius: '50px',
        backgroundColor: 'transparent',
        color: 'white',
        font: '600 0.8rem Poppins, sans-serif',

        '&:hover': {
            backgroundColor: 'primary.main',
            color: 'black',
            transition: 'all 0.2s ease-in-out',
        },

        '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',

            '&:hover': {
                backgroundColor: 'primary.main',
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
