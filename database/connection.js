import mongoose from "mongoose";

const connected = ()=>{
  try {
    mongoose.connect("mongodb://localhost:27017/E-Commerce").then(()=>{
      console.log("DB Connected");
    })
  } catch (error) {
    console.log("Failed connect DB");
  }
}
export default connected