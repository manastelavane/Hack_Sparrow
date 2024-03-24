import Typography from '@mui/material/Typography'
import React from 'react'

export default function SubHeading({children}) {
  return (
    <Typography variant='h2'
                    component='h3'
                    sx={{
                        fontFamily: 'Work Sans',
                        fontWeight: 'medium',
                        fontSize: '2rem',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'primary.dark',
                    }}>
                        {children}
                </Typography>
  )
}
