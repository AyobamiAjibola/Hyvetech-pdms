import { Box } from '@mui/material'
import React from 'react';
import './styles.css'

const Spinner = () => {
    return (
        <Box
            className="logout_container"
        >
            <Box className="logout_loader"></Box>
        </Box>
    );
};

export default Spinner;