import mongoose from "mongoose";

const connected = () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://MostafaMohamed:lordmoha007@cluster0.jufuw.mongodb.net/E-Commerce"
      )
      .then(() => {
        console.log("DB Connected");
      });
  } catch (error) {
    console.log({ message: "Failed connect DB", error: error.message });
  }
};
export default connected;
