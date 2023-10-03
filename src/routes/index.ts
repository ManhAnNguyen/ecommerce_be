import { Router } from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import addressRoutes from "./address";
import userRoutes from "./users";
import bankRoutes from "./banks";
import categoryRoutes from "./category";
import productRoutes from "./products";
import orderRoutes from "./orders";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/address", addressRoutes);
router.use("/user", userRoutes);
router.use("/bank", bankRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);

export default router;
