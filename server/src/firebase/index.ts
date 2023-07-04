import assert from "assert";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as serviceAccountKey from "../../serviceAccountKey.json";

const app = initializeApp({
  credential: cert(JSON.stringify(serviceAccountKey)),
});

const fireAuth = getAuth(app);
export default fireAuth;
