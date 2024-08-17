import { Router } from "express";
import * as userRouter from "./controller/User.controller.js";
import { authentication } from "../../middleware/authentication.js";
import validation from "../../middleware/validation.js";
import userValidationSchema from "./user.validation.js";
import authorization from "../../middleware/authorization.js";
import roles from "../../Types/roles.js";

const router = Router();
router.post("/signUp",validation(userValidationSchema), userRouter.signUp); //1
router.post("/signIn", userRouter.signIn); //2
router.put("/", authentication, userRouter.updateAccount); //3
router.delete("/", authentication,authorization([roles.admin]), userRouter.deletedAccount); //4
router.get("/", authentication,authorization([roles.admin]), userRouter.getUser); //5
router.get("/:id", userRouter.getUserById); //6
router.put("/updatePassword", authentication, userRouter.updatePassword); //7
router.post("/forgetPassword", authentication, userRouter.forgetPassword); //8
router.post("/newPassword", authentication, userRouter.newPassword); //8
router.get("/getUserByEmail",authentication , authorization([roles.admin]), userRouter.getUserByEmail); //9

export default router;
