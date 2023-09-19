const router = require("express").Router();
const bankController = require("../controllers/bank");
const handleJWT = require("../middlewares/handleJWT");
const handleRole = require("../middlewares/handleRole");

router.get("/", bankController.getBanks);

router.use(handleJWT, handleRole);
router.post("/", bankController.createBank);
router.delete("/:id", bankController.deleteBank);

module.exports = router;
