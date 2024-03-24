import Typography from '@mui/material/Typography';
import React from 'react';

export default function Policy({children}) {
  return (
    <Typography 
    variant='h4'
    component='h5'
    sx={{
        fontFamily: 'Work Sans',
        color: 'secondary.main',
        fontFamily: 'Work Sans',
        fontWeight: 'medium',
        fontSize: '1.3rem',
        textAlign: 'left',
    }}>
    {children}
    </Typography>
  )
}
