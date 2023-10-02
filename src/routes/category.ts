import { Router } from "express";
import handleJwt from "../middlewares/handleJWT";
import handleRole from "../middlewares/handleRole";
import { get, create, remove } from "../controllers/category";
const router = Router();

router.get("/", get);

router.use(handleJwt, handleRole);

router.post("/", create);
router.delete("/:id", remove);

export default router;
