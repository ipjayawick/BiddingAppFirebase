import React from 'react';
import CompanyTable from '../../components/CompanyTable';
import UserTable from '../../components/UserTable';
import { Box, Button, Grid } from '@mui/material';
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();
const backupToExcel = httpsCallable(functions, 'backupToExcel');

function AdminPage() {
  return (
    <Box mx={3} mt={3}>
      <Button variant='contained' sx={{ mb: 2 }} onClick={() => backupToExcel()}>Backup All to Excel</Button>
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
