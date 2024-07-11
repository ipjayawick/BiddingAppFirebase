import { onRequest } from "firebase-functions/v2/https";
import { appendRows, addSheet } from "./sheets";
import { getCompaniesRows, getUsersRows } from "./firestore";
import { getApps, initializeApp } from "firebase-admin/app";

export const app = getApps()[0] || initializeApp({})

export const backupAll = onRequest({ cors: true }, async (req, res) => {
    try {
        //get users from database
        const rowArray = getCompaniesRows();
        console.log(rowArray)

        // add users data to sheets 
        const date = new Date()
        const sheetName = `Companies at ${date.getHours()}HH${date.getMinutes()}mm`
        await addSheet(sheetName, 200, 10)
        await new Promise(resolve => setTimeout(resolve, 2000));
        await appendRows(sheetName, rowArray)


        res.status(200).send({
            message: "Companies backup complete",
        })
    } catch (err) {
        res.status(500).send({
            message: `Error backing up companies. Error: ${err}`
        })
    }

    try {
        //get users from database
        const rowArray = getUsersRows();
        console.log(rowArray)

        // add users data to sheets
        const date = new Date()
        const sheetName = `Users at ${date.getHours()}HH${date.getMinutes()}mm`
        await addSheet(sheetName, 200, 10)
        await new Promise(resolve => setTimeout(resolve, 2000));
        await appendRows(sheetName, rowArray)

        res.status(200).send({
            message: "Users backup complete",
        })
    } catch (err) {
        res.status(500).send({
            message: `Error backing up users. Error: ${err}`
        })
    }

})