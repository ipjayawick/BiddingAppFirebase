// @ts-nocheck
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as functions from 'firebase-functions';
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore()

export const registerNewUser = functions.auth.user().onCreate(async (user) => {
  const userData = {
    userId: user.uid,
    userName: user.displayName,
    email: user.email,
    initialBiddingPoints: 100,
    remainingBiddingPoints: 100,
    createdAt: new Date(),
    photoURL: user.photoURL,
    isAdmin: false
  };
  await db.doc(`users/${user.uid}`).set(userData)
});

export const addCompany = onRequest(async (request, response) => {
  const { companyName, description, totalVacancies, biddingMargin } = request.body.data;
  logger.info('Request received:', { body: request.body });
  logger.warn(request.body.data)
  const companyData = {
    companyName,
    description,
    totalVacancies: +totalVacancies,
    remainingVacancies: +totalVacancies,
    biddingMargin: +biddingMargin
  }

  // try {
  //   await db.collection('companies').add(companyData)
  //   response.status(200).send('Company added successfully!');
  // } catch (error) {
  //   console.error('Error adding company to Firestore:', error);
  //   response.status(500).send('Error adding company to Firestore');
  // }

  response.send('done')
});
