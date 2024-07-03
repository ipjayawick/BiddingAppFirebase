import { registerNewUser } from "./registerNewUser";
import { handleBidSubmission } from "./handleSubmit";
import { backupUsers } from "./backupUsers";
import { backupCompanies } from "./backupCompanies";
import { onRequest } from "firebase-functions/v2/https";

const backupAll = onRequest({ cors: true }, async (req, res) => {
  try {
    const userBackupRes = await backupUsers()
    const companyBackupRes = await backupCompanies()
    res.status(200).send({
      message: "backup complete",
      data: `User backup:${userBackupRes},Company backup:${companyBackupRes}`
    })
  } catch (err) {
    res.status(500).send({
      message: `Error backing up data. Error: ${err}`
    })
  }
})

export {
  registerNewUser,
  handleBidSubmission,
  backupAll
} 