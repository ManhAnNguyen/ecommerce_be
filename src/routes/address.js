const handleRole = require("../middlewares/handleRole");
const addressController = require("../controllers/address");
const router = require("express").Router();

router.get("/province", addressController.getProvinces);
router.get("/districts", addressController.getDistricts);
router.get("/communes", addressController.getCommunee);
router.get("/get-all", addressController.getAddress);
//verify admin
router.use(handleRole);
router.post("/province", addressController.createProvince);
router.post("/district", addressController.createDistrict);
router.post("/commune", addressController.createCommune);

module.exports = router;
