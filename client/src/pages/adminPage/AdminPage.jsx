import React from 'react';
import CompanyTable from '../../components/CompanyTable';
import UserTable from '../../components/UserTable';
import { Box, Grid } from '@mui/material';

function AdminPage() {
  return (
    <Box mx={3} mt={5}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <CompanyTable />
        </Grid>
        <Grid item xs={6}>
          <UserTable />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminPage;
