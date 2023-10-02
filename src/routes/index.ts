import { Router } from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import addressRoutes from "./address";
import userRoutes from "./users";
import bankRoutes from "./banks";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/address", addressRoutes);
router.use("/user", userRoutes);
router.use("/bank", bankRoutes);

export default router;
