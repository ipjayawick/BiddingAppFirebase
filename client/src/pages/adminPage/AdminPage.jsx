import React from 'react';
import AddCompany from '../../components/AddCompany'
import CompanyTable from '../../components/CompanyTable';
import UserTable from '../../components/UserTable';
function AdminPage() {
  return (
    <div>
      <CompanyTable />
      <UserTable />
    </div>
  );
}

export default AdminPage;
