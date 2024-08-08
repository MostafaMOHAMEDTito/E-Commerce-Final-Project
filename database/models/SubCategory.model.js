import mongoose, { Types } from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      trim: true,
      minlength: [3, "Minimum length is 3 characters"],
      maxlength: [15, "Maximum length is 15 characters"],
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
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
subCategorySchema.post("init", (doc) => {
  if (doc.image) {
    doc.image = "http://localhost:3000/uploads/subCategory/" + doc.image;
  }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
