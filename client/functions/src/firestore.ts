// @ts-nocheck
import { getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp } from 'firebase-admin/app'

export const app = getApps()[0] || initializeApp({})

const db = getFirestore()

export const getUsersRows = async () => {
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

    return rowArray
}

export const getCompaniesRows = async () => {
    const columnNames = ["Company", "Description", "Total Vacancies", "Remaining Vacancies", "Bidding Margin", "Bidders"]
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

    return rowArray
}