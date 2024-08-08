import { Router } from "express";
import * as userRouter from "./controller/User.controller.js";
import { verifyToken } from "../../middleware/verifyToken.js";


const router = Router();
router.post("/signUp", userRouter.signUp);//1
router.post("/signIn",userRouter.signIn);//2
router.put("/", verifyToken, userRouter.updateAccount);//3
router.delete("/", verifyToken, userRouter.deletedAccount);//4
router.get("/", verifyToken, userRouter.getUser);//5
router.get("/:id",  userRouter.getUserById);//6
router.put("/updatePassword", verifyToken, userRouter.updatePassword);//7
router.post("/forgetPassword", verifyToken, userRouter.forgetPassword);//8
router.post("/newPassword", verifyToken, userRouter.newPassword);//8
router.get("/getUserByEmail",  userRouter.getUserByEmail);//9
//I  tested my APIS in POSTMAN 

export default router;
