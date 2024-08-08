import slugify from "slugify";
import Category from "../../../../database/models/Category.model.js";
import fs from "fs";

// Get all categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error({
      message: "Error fetching categories",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching categories from the database" });
  }
};

// Get a specific category by ID
export const getcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found by this ID" });
    }
    return res
      .status(200)
      .json({ message: "Category retrieved successfully", data: category });
  } catch (error) {
    console.error({
      message: "Error fetching category",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching category from the database" });
  }
};

// Add a new category
export const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    let slug = "";
    if (name) {
      slug = slugify(name, { lower: true, trim: true });
    }

    const existName = await Category.findOne({ name });
    const existSlug = await Category.findOne({ slug });
    if (existName || existSlug) {
      return res
        .status(409)
        .json({ message: "Category name or slug already exists" });
    }
    const category = await Category.create({
      ...req.body,
      slug,
      image: req.file ? req.file.filename : "",
    });
    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error({ message: "Error creating category", error: error.message });
    res
      .status(500)
      .json({ message: "Error creating category in the database" });
  }
};

// Update a category by ID
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required for update" });
    }
    const slug = slugify(name, { lower: true, trim: true });
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found by this ID" });
    }

    // Handle image deletion
    if (category.image && req.file) {
      const imageName = category.image.split(
        "http://localhost:3000/uploads/category/"
      )[1];
      const imagePath = `./uploads/category/${imageName}`;

      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error({
              message: "Error deleting file",
              error: err.message,
            });
          }
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, image: req.file?.filename },
      { new: true }
    );

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error({ message: "Error updating category", error: error.message });
    res
      .status(500)
      .json({ message: "Error updating category in the database" });
  }
};
//...deleted Category

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const categoryDeleted = await Category.findByIdAndDelete(id);
    return categoryDeleted
      ? res.status(209).json({
          message: "Category deleted successfully",
          data: categoryDeleted,
        })
      : res.status(404).json({ message: "Category not found by this ID" });
  } catch (error) {
    console.error({ message: "Error updating category", error: error.message });
    res
      .status(500)
      .json({ message: "Error updating category in the database" });
  }
};
