const admin = require("firebase-admin");
const serviceAccount = require("../secrets/serviceAccountKey.json"); // path to your service account key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
