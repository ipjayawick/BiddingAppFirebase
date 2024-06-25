// @ts-nocheck
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as functions from 'firebase-functions';
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore()

// export const test = onRequest({ cors: true }, async (request, response) => {

//   // await db.collection('companies').add(companyData)
//   // const data = await db.doc("authData/adminUsers").get()
//   // console.log(data.data().userEmails.includes('ipjayawick@gmail.com'))

// });

export const registerNewUser = functions.auth.user().onCreate(async (user) => {
  const data = await db.doc("authData/adminUsers").get()
  const isAdmin = data.data().userEmails.includes(user.email)

  const userData = {
    userId: user.uid,
    userName: user.displayName,
    email: user.email,
    initialBiddingPoints: 100,
    remainingBiddingPoints: 100,
    createdAt: new Date(),
    photoURL: user.photoURL,
    isAdmin: isAdmin
  };

  await db.doc(`users/${user.uid}`).set(userData)
});

export const addCompany = onRequest({ cors: true }, async (request, response) => {
  const { companyName, description, totalVacancies, biddingMargin } = request.body.data;
  logger.info('Request received:', { body: request.body });
  const companyData = {
    companyName,
    description,
    totalVacancies: +totalVacancies,
    remainingVacancies: +totalVacancies,
    biddingMargin: +biddingMargin
  }

  try {
    await db.collection('companies').add(companyData)
    response.status(200).send({ data: 'Company added successfully!' });
  } catch (error) {
    console.error('Error adding company to Firestore:', error);
    response.status(500).send({ data: 'Error adding company to Firestore' });
  }

});
