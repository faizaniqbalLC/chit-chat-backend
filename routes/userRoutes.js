import express from "express";
import {
  getAllUsers,
  login,
  register,
  setAvatar,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);

export default router;
