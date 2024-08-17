import mongoose, { Types } from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      trim: true,
      minlength: [3, "Minimum length is 3 characters"],
      maxlength: [15, "Maximum length is 15 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowerCase: true,
    },
    image: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "CreatedBy is required"],
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
brandSchema.post("init", (doc) => {
  if (doc.image) {
    doc.image = "http://localhost:3000/uploads/brand/" + doc.image;
  }
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
