import { logger } from "firebase-functions";
import * as functions from 'firebase-functions';
import { getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, } from 'firebase-admin/app'

export const app = getApps()[0] || initializeApp({})
const db = getFirestore()

export const registerNewUser = functions.auth.user().onCreate(async (user) => {
  try {
    const data = await db.doc("authData/adminUsers").get();
    const isAdmin = data.data()?.userEmails.includes(user.email);

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
