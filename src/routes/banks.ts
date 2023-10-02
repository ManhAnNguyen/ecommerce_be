import { Router } from "express";
import handleJwt from "../middlewares/handleJWT";
import handleRole from "../middlewares/handleRole";
import { getBanks, createBank, deleteBank } from "../controllers/banks";

const router = Router();

router.get("/", getBanks);

router.use(handleJwt, handleRole);
router.post("/", createBank);
router.delete("/:id", deleteBank);

export default router;
