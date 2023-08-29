import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import path from "path";

export const saveToTempFolder = async (file: Buffer, name: string) => {
  const tempFolderPath = path.join(__dirname, "temp");
  const uniqueFileName = `${uuid()}-${name}`;
  const tempFilePath = path.join(tempFolderPath, uniqueFileName);

  await fs.mkdir(tempFolderPath, { recursive: true });

  await fs.writeFile(tempFilePath, file);

  return tempFilePath;
};
