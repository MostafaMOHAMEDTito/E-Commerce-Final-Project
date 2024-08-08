import mongoose, { Types } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      trim: true,
      minlength: [3, "Minimum length is 3 characters"],
      maxlength: [30, "Maximum length is 15 characters"],
    },
    image: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowerCase: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      // required: [true, "CreatedBy is required"],
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
categorySchema.post("init", (doc) => {
  if (doc.image) {
    doc.image = "http://localhost:3000/uploads/category/" + doc.image;
  }
});
const Category = mongoose.model("Category", categorySchema);
export default Category;
