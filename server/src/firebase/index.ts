import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import process from "process";
import * as SA from "./serviceAccountKey.json"; 

const app = initializeApp({
  credential: cert(SA as ServiceAccount),
});

const fireAuth = getAuth(app);
export default fireAuth;
