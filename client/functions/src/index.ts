// @ts-nocheck
import { onRequest } from "firebase-functions/v2/https";
import { db } from "./firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import * as functions from 'firebase-functions';


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
    await setDoc(doc(db, 'users', user.uid), userData);
});


export const addCompany = onRequest(async (request, response) => {
    const { companyName, description, totalVacancies, biddingMargin } = request.body.data;
    console.log(request.headers.authorization)
    // try {
    //     await addDoc(collection(db, "companies",), {
    //         companyName,
    //         description,
    //         totalVacancies: +totalVacancies,
    //         remainingVacancies: +totalVacancies,
    //         biddingMargin: +biddingMargin
    //     });
    //     response.status(200).send('Company added successfully!');
    // } catch (error) {
    //     console.error('Error adding company to Firestore:', error);
    //     response.status(500).send('Error adding company to Firestore');
    // }
    response.send('done')
});
