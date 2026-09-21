const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// You must set the GOOGLE_APPLICATION_CREDENTIALS environment variable 
// to the path of your service account key JSON file in backend/.env, OR
// place the serviceAccountKey.json file in this directory and require it.
// e.g., const serviceAccount = require("./serviceAccountKey.json");
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

// Fallback to default application credentials if GOOGLE_APPLICATION_CREDENTIALS is set
try {
  admin.initializeApp();
} catch (error) {
  console.error("Firebase Admin initialization error", error.stack);
}

module.exports = admin;
