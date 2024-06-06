import React from 'react'
import AddCompany from '../../components/AddCompany'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

function AdminPage() {

  const addCompany = async (companyName, description, biddingMargin, totalVacancies) => {
    try {
      await addDoc(collection(db, "companies",), {
        companyName,
        description,
        totalVacancies,
        remaningVacancies:totalVacancies,
        biddingMargin
      });
    } catch (error) {
      console.error('Error adding company to Firestore:', error);
    }
  };

  return (
    <div>
      <AddCompany addCompany={addCompany} />
    </div>
  )
}

export default AdminPage