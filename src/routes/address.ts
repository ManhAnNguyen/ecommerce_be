import { Router } from "express";
import handleRole from "../middlewares/handleRole";
import {
  createProvince,
  getProvinces,
  getDistricts,
  createDistrict,
  createCommune,
  getCommnue,
  getAddress,
} from "../controllers/address";
import handleJwt from "../middlewares/handleJWT";

const router = Router();

router.get("/province", getProvinces);
router.get("/district", getDistricts);
router.get("/communes", getCommnue);
router.get("/get-all", getAddress);
//verify admin
router.use(handleJwt, handleRole);
router.post("/province", createProvince);
router.post("/district", createDistrict);
router.post("/commune", createCommune);

export default router;
