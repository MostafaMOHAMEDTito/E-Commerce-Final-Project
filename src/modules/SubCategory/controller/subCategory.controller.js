import slugify from "slugify";
import SubCategory from "../../../../database/models/SubCategory.model.js";
import Category from "../../../../database/models/Category.model.js";

// Get all subcategories
export const getSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find();
    return res.json({
      message: "Subcategories retrieved successfully",
      data: subCategories,
    });
  } catch (error) {
    console.error({
      message: "Error fetching subcategories",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching subcategories from the database" });
  }
};
export const getSubCategoriesByCategory = async (req, res, next) => {
  try {
    
    const subCategories = await SubCategory.find({category:req.params.id}).populate("category");
    return res.json({
      message: "Subcategories retrieved successfully",
      data: subCategories,
    });
  } catch (error) {
    console.error({
      message: "Error fetching subcategories",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching subcategories from the database" });
  }
};

// Get a specific subcategory by ID
export const getSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Subcategory ID is required" });
    }

    const subCategory = await SubCategory.findById(id).populate("category");
    if (!subCategory) {
      return res
        .status(404)
        .json({ message: "Subcategory not found by this ID" });
    }
    return res.status(200).json({
      message: "Subcategory retrieved successfully",
      data: subCategory,
    });
  } catch (error) {
    console.error({
      message: "Error fetching subcategory",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching subcategory from the database" });
  }
};

// Add a new subcategory
export const addSubCategory = async (req, res, next) => {
  try {
    const { name, category } = req.body;
    const slug = slugify(name, { lower: true, trim: true });

    const existName = await SubCategory.findOne({ name });
    const existSlug = await SubCategory.findOne({ slug });

    if (existName || existSlug) {
      return res
        .status(409)
        .json({ message: "Subcategory name or slug already exists" });
    }

    const getcategory = await Category.findById(category);

    if (!getcategory) {
      return res.status(409).json({ message: "Category is not exist" });
    }

    const subCategory = await SubCategory.create({
      ...req.body,
      slug,
      image: req.file?.filename,
    });
    return res.status(201).json({
      message: "Subcategory created successfully",
      data: subCategory,
    });
  } catch (error) {
    console.error({
      message: "Error creating subcategory",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error creating subcategory in the database" });
  }
};

// Update a subcategory by ID
export const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Subcategory ID is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required for update" });
    }
    const slug = slugify(name, { lower: true, trim: true });
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res
        .status(404)
        .json({ message: "Subcategory not found by this ID" });
    }
    // Handle image deletion
    if (subCategory.image && req.file) {
      const imageName = subCategory.image.split(
        "http://localhost:3000/uploads/subCategory/"
      )[1];
      const imagePath = `./uploads/subCategory/${imageName}`;

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

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { name, slug, category, image: req.file?.filename },
      { new: true }
    );

    return res.status(200).json({
      message: "Subcategory updated successfully",
      data: updatedSubCategory,
    });
  } catch (error) {
    console.error({
      message: "Error updating subcategory",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error updating subcategory in the database" });
  }
};

// Delete a subcategory by ID
export const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Subcategory ID is required" });
    }
    const subCategoryDeleted = await SubCategory.findByIdAndDelete(id);
    return subCategoryDeleted
      ? res.status(200).json({
          message: "Subcategory deleted successfully",
          data: subCategoryDeleted,
        })
      : res.status(404).json({ message: "Subcategory not found by this ID" });
  } catch (error) {
    console.error({
      message: "Error deleting subcategory",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error deleting subcategory from the database" });
  }
};
//merge params (get all subCategories in specific category)
