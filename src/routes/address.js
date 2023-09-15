const handleRole = require("../middlewares/handleRole");
const addressController = require("../controllers/address");
const router = require("express").Router();

router.use(handleRole);

router.post("/province", addressController.createProvince);

module.exports = router;
