// @ts-nocheck
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as functions from 'firebase-functions';
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMetaData } from "./sheets";

initializeApp();
const db = getFirestore()

export const test = onRequest({ cors: true }, async (request, response) => {
  // await db.collection('companies').add(companyData)
  // const data = await db.doc("authData/adminUsers").get()
  // console.log(data.data().userEmails.includes('ipjayawick@gmail.com'))
  const metadata=await getMetaData()
  console.log(metadata)
});

export const registerNewUser = functions.auth.user().onCreate(async (user) => {
  try {
    const data = await db.doc("authData/adminUsers").get();
    const isAdmin = data.data().userEmails.includes(user.email);

    const userData = {
      userId: user.uid,
      userName: user.displayName,
      email: user.email,
      initialBiddingPoints: 100,
      remainingBiddingPoints: 100,
      createdAt: new Date(),
      photoURL: user.photoURL,
      isAdmin: isAdmin,
    };

    await db.doc(`users/${user.uid}`).set(userData);
  } catch (error) {
    logger.error("Error registering new user:", error)
  }
});