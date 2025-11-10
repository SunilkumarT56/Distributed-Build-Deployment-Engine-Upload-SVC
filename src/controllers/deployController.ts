import { v4 as uuid } from "uuid";
import { simpleGit } from "simple-git";
import path from "path";
import { fileURLToPath } from "url";
import { getAllFiles } from "../utils/file.js";
import { uploadFile } from "../s3/uploadToS3.js"
import {createClient} from "redis";
import type { Request, Response } from 'express';


const publisher = createClient();
publisher.connect().catch(console.error);
publisher.on("ready", () => console.log("✅ Redis connected"));
publisher.on("error", err => console.error("❌ Redis error:", err));


const git = simpleGit();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deployService = async function (req: Request, res: Response) {
    const {repoUrl} = req.body;
    const id = uuid();
   await git.clone(repoUrl, path.join(__dirname,`output/${id}`));
   const files = getAllFiles(path.join(__dirname,`output/${id}`));
   try {
  for (const file of files) {
    if (file.includes(".git") || file.includes(".DS_Store")) continue;
    console.log("📤 Uploading:", file);
    await uploadFile(file.slice(__dirname.length + 1), file);
  }

  console.log("✅ Upload done, pushing status to Redis...", id);
  await publisher.hSet("status", id, "uploading");
  await publisher.lPush("build-queue", id);

  res.json({ id });
} catch (err) {
  console.error("❌ Error during deployService:", err);
  res.status(500).json({ error : "Internal Server Error" });
}

}