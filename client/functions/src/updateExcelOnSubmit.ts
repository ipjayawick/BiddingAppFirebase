// @ts-nocheck
import { appendRows, clearSheetData } from "./sheets";
import { getCompaniesRows, getUsersRows } from "./firestore";

export const updateExcelOnSubmit = async () => {
    try {
        await clearSheetData("Users")
        const usersRowsArr = getUsersRows();
        await appendRows("Users", usersRowsArr)
    } catch (error) {
        console.log("Error updating users sheet")
    }

    try {
        await clearSheetData("Companies")
        const companiesRowsArr = getCompaniesRows();
        await appendRows("Companies", companiesRowsArr)
    } catch (error) {
        console.log("Error updating companies sheet")
    }
}
