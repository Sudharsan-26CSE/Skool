const { initializeApp } = require("firebase-admin/app");

try {
  initializeApp({
    projectId: "fity-500005"
  });
  console.log("Firebase Admin initialized with projectId: fity-500005");
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error("Firebase Admin initialization error", error.stack);
  }
}

module.exports = {};
