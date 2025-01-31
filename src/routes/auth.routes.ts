import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);

router.post("/login", validateRequest(loginSchema), loginUser);

router.post("/logout", logoutUser);

router.post("/refresh", refreshToken);

export default router;
