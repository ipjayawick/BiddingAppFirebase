// @ts-nocheck
import { onRequest } from "firebase-functions/v2/https";
import { appendRows, addSheet } from "./sheets";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, } from 'firebase-admin/app'
import { google } from "googleapis";

export const app = getApps()[0] || initializeApp({})

const db = getFirestore()

// Write rows to the spreadsheet
export const backupUsers = async () => {
    //get users from database
    const keysToExtract = ["userId", "userName", "initialBiddingPoints", "remainingBiddingPoints", "companies"]
    const columnNames = ["User ID", "User Name", "Initial Bidding Points", "Remaining Bidding Points", "Companies"]
    const docs = (await db.collection('users').get()).docs
    const rowArray = docs.map(doc => {
        const user = doc.data()
        const row = [user.userId, user.userName, user.initialBiddingPoints, user.remainingBiddingPoints]
        if (user.companies?.length == 0) {
            row.push("null")
        } else {
            row.push(user.companies.join(', '))
        }
        return row
    })
    rowArray.unshift(columnNames)
    console.log(rowArray)

    // add users data to sheets
    const date = new Date()
    const sheetName = `Users at ${date.getHours()}HH${date.getMinutes()}mm`
    await addSheet(sheetName, 200, 10)
    await new Promise(resolve => setTimeout(resolve, 2000));
    await appendRows(sheetName, rowArray)
}
