import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const Overview = ({ colleges }) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Total Colleges
                        </Typography>
                        <Typography variant="h3">
                            {colleges.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            {/* Add more stats cards here */}
        </Grid>
    );
};

export default Overview;
