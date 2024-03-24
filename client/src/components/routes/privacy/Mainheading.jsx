import Typography from '@mui/material/Typography';
import React from 'react';

export default function Mainheading({children}) {
  return (
        <Typography 
            variant='h2'
            component='h3'
            sx={{
                fontFamily: 'Work Sans',
                mb: '1rem',
                fontWeight: 'medium',
                fontSize: '2.5rem',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                color: 'primary.dark',
            }}
        >
            {children}
        </Typography>
    );
}
