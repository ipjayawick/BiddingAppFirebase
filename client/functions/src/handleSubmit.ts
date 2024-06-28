// @ts-nocheck
import { onRequest } from "firebase-functions/v2/https";
import { appendRows } from "./sheets";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, } from 'firebase-admin/app'

export const app = getApps()[0] || initializeApp({})

const db = getFirestore()

export const handleBidSubmission = onRequest({ cors: true }, async (request, response) => {
    const liveCompanyData = await db.doc("controlData/activeCompany").get()
    const liveCompany = liveCompanyData.data() //control data
    const liveCompanyId = liveCompany?.activeCompanyId
    const liveBidderIds = liveCompany?.bidders.map(bidder => bidder.userId)

    const activeCompanyData = await db.doc(`companies/${liveCompanyId}`).get()
    const activeCompany = activeCompanyData.data() //active company

    try {
        const batch = db.batch();

        //add bidders to the company entity
        batch.update(db.doc(`companies/${liveCompanyId}`), {
            bidders: FieldValue.arrayUnion(...liveCompany?.bidders),
            remainingVacancies: FieldValue.increment(-liveCompany?.bidders.length)
        })

        //add companies to users entities
        const querySnapshot = await db.collection('users').get()

        querySnapshot.forEach((docSnapshot) => {
            if (liveBidderIds.includes(docSnapshot.id)) {
                batch.update(db.doc(`users/${docSnapshot.id}`), {
                    remainingBiddingPoints: FieldValue.increment(-activeCompany?.biddingMargin),
                    companies: FieldValue.arrayUnion(activeCompany?.companyName)
                });
            }
        });

        //clear live bidders
        batch.update(db.doc("controlData/activeCompany"), {
            bidders: []
        })

        await batch.commit();
        
        appendRows([["yoo","hoo"]])
    } catch (error) {
        console.error('Error submitting the bid: ', error);
    }
});
