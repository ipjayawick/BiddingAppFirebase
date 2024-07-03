// @ts-nocheck
import { onRequest } from "firebase-functions/v2/https";
import { appendRows, addSheet } from "./sheets";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, } from 'firebase-admin/app'
import { google } from "googleapis";

export const app = getApps()[0] || initializeApp({})

const db = getFirestore()

// Write rows to the spreadsheet
export const backupCompanies =  async () => {
    //get users from database
    const columnNames = ["Company", "Description", "Total Vacancies", "Remaining Vacancies", "Bidding Margin","Bidders"]
    const docs = (await db.collection('companies').get()).docs
    const rowArray = docs.map(doc => {
        const company = doc.data()
        const row = [company.companyName, company.description, company.totalVacancies, company.remainingVacancies, company.biddingMargin]
        if (!company.bidders || company.bidders.length == 0) {
            row.push("null")
        } else {
            company.bidders.map(bidder => bidder.userId)
            row.push(company.bidders.map(bidder => bidder.userId).join(', '))
        }
        return row
    })
    rowArray.unshift(columnNames)
    console.log(rowArray)

    // add users data to sheets
    const date = new Date()
    const sheetName = `Companies at ${date.getHours()}HH${date.getMinutes()}mm`
    await addSheet(sheetName, 200, 10)
    await new Promise(resolve => setTimeout(resolve, 2000));
    await appendRows(sheetName, rowArray)
}
