import admin from "firebase-admin";
// import path from "path";
import serviceAccount from "./firebase/firebaseServiceAccountKey.json" with { type: "json" };

// const serviceAccount = require(path.resolve(__dirname, "firebaseServiceAccountKey.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
})

const db = admin.firestore();

export {admin, db};