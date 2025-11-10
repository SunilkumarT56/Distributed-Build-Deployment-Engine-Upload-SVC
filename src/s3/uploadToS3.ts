import fs from "fs";
import { s3 } from "./s3Client.js";



export const uploadFile = async (filePath: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!, 
    Key: filePath, 
    Body: fileContent,
    ContentType: "application/octet-stream", 
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`✅ Uploaded Successfully: ${data.Location}`);
    return data.Location;
  } catch (err) {
    console.error("❌ Upload Failed:", err);
    throw err;
  }
};