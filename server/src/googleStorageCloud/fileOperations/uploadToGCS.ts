import cloudBucket from "..";

const uploadToGCS = async (
  buffer: Buffer,
  bucketName: string,
  fileName: string
) => {
  try {
    let publicUrl: string | null = null;
    const file = cloudBucket.file(`${bucketName}/${fileName}`);
    const stream = file.createWriteStream({
      resumable: false,
      metadata: {
        contentType: "image/png", // Replace with the appropriate content type
      },
    });

    return new Promise((resolve, reject) => {
      stream.on("error", (error) => {
        console.error("Error uploading to GCS:", error);
        reject(error);
      });

      stream.on("finish", () => {
        //console.log(`Uploaded ${fileName} to GCS.`);
        publicUrl = `https://storage.googleapis.com/${cloudBucket.name}/${file.name}`;
        resolve(publicUrl);
      });

      stream.end(buffer);
    });
  } catch (error) {
    throw error;
  }
};

export default uploadToGCS;
