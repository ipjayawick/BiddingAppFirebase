import React from 'react';
import AddCompany from '../../components/AddCompany'
import CompanyTable from '../../components/CompanyTable';
import UserTable from '../../components/UserTable';
import { Box, Container, Grid } from '@mui/material';
function AdminPage() {
  return (
    // <Container maxWidth="xl" sx={{mt:5}}>
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
    // </Container >
  );
}

export default AdminPage;
