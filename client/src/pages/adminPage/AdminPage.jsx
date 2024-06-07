import React from 'react';
import AddCompany from '../../components/AddCompany'
import CompanyTable from '../../components/CompanyTable';
function AdminPage() {
  return (
    <div>
      <AddCompany />
      <CompanyTable/>
    </div>
  );
}

export default AdminPage;
