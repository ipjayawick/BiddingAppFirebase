// @ts-nocheck
import { onRequest } from "firebase-functions/v2/https";
import { appendRows } from "./sheets";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getApps, initializeApp, } from 'firebase-admin/app'
import { google } from "googleapis";

export const app = getApps()[0] || initializeApp({})

const db = getFirestore()


const spreadsheetId = "1_MF9QzFyeeQRkvLckv8MvJ8X32cKQavQp54DQaPKPfY";

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

// Initialize Google Sheets API
let googleSheets;

const initializeGoogleSheets = async () => {
    if (!googleSheets) {
        const client = await auth.getClient();
        googleSheets = google.sheets({ version: "v4", auth: client });
    }
};

// Write rows to the spreadsheet
export const backupUsers =onRequest({ cors: true }, async (req, res) => {
    await initializeGoogleSheets();
    const request = {
        spreadsheetId: spreadsheetId,
        resource: {
            requests: [
                {
                    addSheet: {
                        properties: {
                            title: `users @ ${new Date().toISOString()}`,
                            gridProperties: {
                                rowCount: 250,
                                columnCount: 10
                            }
                        }
                    }
                }
            ]
        },
        auth: auth
    };

    await googleSheets.spreadsheets.batchUpdate(request, (err, response) => {
        if (err) return console.error('The API returned an error: ' + err);
        console.log('Sheet added:', response.data);
    });
});

