// @ts-nocheck
import { appendRows, clearSheetData } from "./sheets";
import { getCompaniesRows, getUsersRows } from "./firestore";

export const updateExcelOnSubmit = async () => {
    try {
        await clearSheetData("Users")
        const usersRowsArr = await getUsersRows();
        console.log(usersRowsArr,"dadadasda")
        await appendRows("Users", usersRowsArr)
    } catch (error) {
        console.log("Error updating users sheet")
    }

    try {
        await clearSheetData("Companies")
        const companiesRowsArr = await getCompaniesRows();
        console.log(companiesRowsArr)
        await appendRows("Companies", companiesRowsArr)
    } catch (error) {
        console.log("Error updating companies sheet")
    }
}
