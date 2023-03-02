import express from "express";
import {
  getAllMessage,
  addMessage,
} from "../controllers/messagesController.js";
const router = express.Router();

router.post("/addMsg/", addMessage);
router.post("/getmsg/", getAllMessage);

export default router;
