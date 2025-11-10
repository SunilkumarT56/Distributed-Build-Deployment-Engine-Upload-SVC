import express from "express"
import { deployService } from "../controllers/deployController.js";

const router = express.Router();

router.post("/" , deployService);

export default router;