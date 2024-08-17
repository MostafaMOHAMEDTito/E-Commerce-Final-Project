import connected from "../database/connection.js";
import userRouter from "../src/modules/User/User.routes.js";
import globalError from "./middleware/globalError.js";
import categoryRouter from "./modules/Category/Category.routes.js";
import subCategoryRouter from "./modules/SubCategory/subCategory.routes.js";
import brandRouter from "./modules/Brand/brand.routes.js";
import productRouter from "./modules/Product/product.routes.js";
import couponRouter from "./modules/Coupon/coupon.routes.js";
import cartRouter from "./modules/Cart/cart.routes.js";
import orderRouter from "./modules/Order/order.routes.js";

import dotenv from "dotenv";

const bootstrap = (app, express) => {
  process.on("uncaughtException", (err) => {
    console.log(err.message);
  });
  connected();
  dotenv.config();
  app.use("/uploads", express.static("uploads"));
  app.use(express.json());
  app.use("/users", userRouter);
  app.use("/category", categoryRouter);
  app.use("/subCategory", subCategoryRouter);
  app.use("/brand", brandRouter);
  app.use("/product", productRouter);
  app.use("/coupon", couponRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);

  app.use("*", (req, res, next) => {
    res.json({ message: `URL Not Found ${req.originalUrl}` });
  });
  app.use(globalError);
  process.on("unhandledRejection", (err) => {
    console.error(err.message);
  });
};

export default bootstrap;
