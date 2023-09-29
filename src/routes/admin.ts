import { Router } from "express";
import { login, lockedUser } from "../controllers/admin";
import handleJwt from "../middlewares/handleJWT";
import handleRole from "../middlewares/handleRole";
const router = Router();

router.post("/login", login);

router.use(handleJwt, handleRole);

router.post("/user/locked", lockedUser);

export default router;
