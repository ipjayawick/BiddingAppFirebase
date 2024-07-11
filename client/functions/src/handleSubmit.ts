// @ts-nocheck
import { onRequest } from "firebase-functions/v2/https";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, } from 'firebase-admin/app'
import { updateExcelOnSubmit } from "./updateExcelOnSubmit";

export const app = getApps()[0] || initializeApp({})

const db = getFirestore()

export const handleBidSubmission = onRequest({ cors: true }, async (request, response) => {
    const liveCompanyData = await db.doc("controlData/activeCompany").get()
    const liveCompany = liveCompanyData.data() //control data
    const liveCompanyId = liveCompany?.activeCompanyId
    const liveBidderIds = liveCompany?.bidders.map(bidder => bidder.userId)
    if (!liveBidderIds) {
        console.log("No live bidders")
        response.status(204).send({ message: "No live bidders!" })
    }

    const activeCompanyData = await db.doc(`companies/${liveCompanyId}`).get()
    const activeCompany = activeCompanyData.data() //active company

    try {
        const batch = db.batch();

        //add bidders to the company entity
        console.log(liveCompany?.bidders, "yoooo")
        // batch.update(db.doc(`companies/${liveCompanyId}`), {
        //     bidders: FieldValue.arrayUnion(...liveCompany?.bidders),
        //     remainingVacancies: FieldValue.increment(-liveCompany?.bidders.length)
        // })

        //add companies to users entities
        const querySnapshot = await db.collection('users').get()

        querySnapshot.forEach((docSnapshot) => {
            if (liveBidderIds.includes(docSnapshot.id)) {
                console.log(activeCompany?.companyName, "hooo")
                // batch.update(db.doc(`users/${docSnapshot.id}`), {
                //     remainingBiddingPoints: FieldValue.increment(-activeCompany?.biddingMargin),
                //     companies: FieldValue.arrayUnion(activeCompany?.companyName)
                // });
            }
        });

        //clear live bidders
        batch.update(db.doc("controlData/activeCompany"), {
            bidders: []
        })

        await batch.commit();
        await updateExcelOnSubmit();
        response.status(200).send({ message: "Bid submitted succesfully" })
    } catch (error) {
        console.error('Error submitting the bid: ', error);
        response.status(500).send({ message: "Error submitting bid", error: error })
    }
});
