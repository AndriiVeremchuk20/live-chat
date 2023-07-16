import { Storage } from "@google-cloud/storage";
import * as GoogleStorageKey from "./googleStorageKey.json"

const projectId = process.env.GOOGLE_CLOUD_STORAGE_PROJECT_ID;
const buckenName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME;

const cloudStorage = new Storage({
  credentials: GoogleStorageKey,
  projectId,
});

const cloudBucket = cloudStorage.bucket(buckenName as string);

export default cloudBucket; 
