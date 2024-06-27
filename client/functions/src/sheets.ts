// @ts-nocheck
import { google } from "googleapis";

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

// Get metadata about the spreadsheet
export const getMetaData = async () => {
  await initializeGoogleSheets();
  const metaData = await googleSheets.spreadsheets.get({
    spreadsheetId,
  });
  return metaData.data;
};

// Read rows from the spreadsheet
export const getRows = async () => {
  await initializeGoogleSheets();
  const rows = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:A",
  });
  return rows.data.values;
};

// Write rows to the spreadsheet
export const appendRows = async (values) => {
  await initializeGoogleSheets();
  await googleSheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values,
    },
  });
};