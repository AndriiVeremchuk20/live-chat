import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import process from "process";
import * as SA from "./serviceAccountKey.json"; 
//import {project_id, client_email} from "./serviceAccountKey.json";

//console.log(process.env.FIREBASE_PRIVATE_KEY)

//const {private_key} = JSON.parse(process.env.FIREBASE_PRIVATE_KEY||"".replace(/\\n/g, '\n') || '{private_key: null}');
//const client_email = process.env.FIREBASE_CLIENT_EMAIL;
//const project_id = process.env.FIREBASE_PROJECT_ID;
//console.log(private_key)

const app = initializeApp({
  credential: cert(SA as ServiceAccount),
});

const fireAuth = getAuth(app);
export default fireAuth;
