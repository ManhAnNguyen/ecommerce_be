import { Router } from "express";
import { get, create, update, hiddenProduct } from "../controllers/products";
import handleJwt from "../middlewares/handleJWT";
import handleRole from "../middlewares/handleRole";
import upload from "../middlewares/handleUpload";
import handleCheckbody from "../middlewares/handleCheckbody";

const router = Router();

router.get("/", get);
// router.get("/review/:productId", getReview);

router.use(handleJwt);
// router.post(
//   "/review",
//   upload("review").single("image"),
//   createReview
// );
// router.patch(
//   "/review",
//   upload("review").single("image"),
//   updateReview
// );

// router.delete("/review", deleteProduct);
router.use(handleRole);
router.post("/", upload("products").single("image"), create);
router.post("/hidden", hiddenProduct);

router.post(
  "/:id",
  upload("products").single("image"),
  handleCheckbody(["hidden", "id", "category_id"]),
  update
);

export default router;