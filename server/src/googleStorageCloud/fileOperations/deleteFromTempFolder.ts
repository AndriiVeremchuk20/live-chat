import { unlink } from "fs/promises";
const deleteFromTempFolder = async (filepath: string) => {
  try {
    await unlink(filepath);
    return true;
    //console.log(`File ${fileName} deleted successfully.`);
  } catch (err) {
    console.error(`Error deleting file ${filepath}:`, err);
    return false;
  }
};

export default deleteFromTempFolder;
