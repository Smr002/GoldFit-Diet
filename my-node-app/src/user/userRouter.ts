import { Router } from "express";
import { userController } from "./userController";
import { authenticateJWT } from "../auth/JWT/authMiddleware";

const router = Router();

router.post("/", (req, res) => userController.create(req, res));


router.use(authenticateJWT);

router.get("/email/:email", async (req, res) => {
  await userController.getByEmail(req, res);
});

router.get("/", (req, res) => userController.getAll(req, res));


router.get("/:id", async (req, res) => {
  await userController.getById(req, res);
});
router.get("/admin/:id", async (req, res) => {
  await userController.getAdminById(req, res);
});
router.put("/:id", (req, res) => userController.update(req, res));
router.delete("/:id", (req, res) => userController.delete(req, res));

export default router;
