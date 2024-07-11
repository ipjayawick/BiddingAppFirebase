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

// // Get metadata about the spreadsheet
// export const getMetaData = async () => {
//   await initializeGoogleSheets();
//   const metaData = await googleSheets.spreadsheets.get({
//     spreadsheetId,
//   });
//   return metaData.data;
// };

// // Read rows from the spreadsheet
// export const getRows = async () => {
//   await initializeGoogleSheets();
//   const rows = await googleSheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: "Sheet1!A:A",
//   });
//   return rows.data.values;
// };

// //Get existing sheet
// export const sheetExists = (sheetTitle) => {
//   try {
//     const response = await googleSheets.spreadsheets.get({ spreadsheetId: spreadsheetId });
//     const sheetExists = response.data.sheets.some(sheet => sheet.properties.title === sheetTitle);
//     return sheetExists
//   } catch (err) {
//     console.error('Error:', err);
//     return false
//   }
// }

export const clearSheetData = async (sheetName) => {
  try {
    await initializeGoogleSheets();
    // Get the sheet ID
    const spreadsheet = await googleSheets.spreadsheets.get({ spreadsheetId: spreadsheetId });
    const sheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === sheetName);

    if (!sheet) {
      console.log(`Sheet "${sheetName}" does not exist.`);
      return;
    }

    const request = {
      spreadsheetId: spreadsheetId,
      range: sheetName
    };

    await googleSheets.spreadsheets.values.clear(request);
    console.log(`Cleared data from sheet: ${sheetName}`);
  } catch (err) {
    console.error('Error clearing sheet data:', err);
    throw err
  }
}

// Write rows to the spreadsheet
export const appendRows = async (sheet, values) => {
  await initializeGoogleSheets();
  await googleSheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheet}!A:B`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: values,
    },
  });
}

//add sheet
export const addSheet = async (title, rowCount, columnCount) => {
  await initializeGoogleSheets();
  const request = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: [
        {
          addSheet: {
            properties: {
              title: title,
              gridProperties: {
                rowCount: rowCount,
                columnCount: columnCount
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
}
