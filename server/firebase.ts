import admin from "firebase-admin";
import path from "path";

const serviceAccount = require(path.resolve(__dirname, "firebaseServiceAccountKey.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();

export {admin, db};