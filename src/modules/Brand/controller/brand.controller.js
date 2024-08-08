import slugify from "slugify";
import Brand from "../../../../database/models/Brand.model.js";

// Get all brands
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find();
    return res.json({
      message: "Brands retrieved successfully",
      data: brands,
    });
  } catch (error) {
    console.error({
      message: "Error fetching brands",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching brands from the database" });
  }
};

// Get a specific brand by ID
export const getBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Brand ID is required" });
    }

    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found by this ID" });
    }
    return res
      .status(200)
      .json({ message: "Brand retrieved successfully", data: brand });
  } catch (error) {
    console.error({
      message: "Error fetching brand",
      error: error.message,
    });
    res.status(500).json({ message: "Error fetching brand from the database" });
  }
};

// Add a new brand
export const addBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, trim: true });

    const existName = await Brand.findOne({ name });
    const existSlug = await Brand.findOne({ slug });

    if (existName || existSlug) {
      return res
        .status(409)
        .json({ message: "Brand name or slug already exists" });
    }

    const brand = await Brand.create({
      ...req.body,
      slug,
      image: req.file?.filename,
    });
    return res.status(201).json({
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    console.error({ message: "Error creating brand", error: error.message });
    res.status(500).json({ message: "Error creating brand in the database" });
  }
};

// Update a brand by ID
export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Brand ID is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required for update" });
    }
    const slug = slugify(name, { lower: true, trim: true });
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found by this ID" });
    }
    // Handle image deletion
    if (brand.image && req.file) {
      const imageName = brand.image.split(
        "http://localhost:3000/uploads/brand/"
      )[1];
      const imagePath = `./uploads/brand/${imageName}`;

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

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, slug, image: req.file?.filename },
      { new: true }
    );

    return res.status(200).json({
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    console.error({ message: "Error updating brand", error: error.message });
    res.status(500).json({ message: "Error updating brand in the database" });
  }
};

// Delete a brand by ID
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Brand ID is required" });
    }
    const brandDeleted = await Brand.findByIdAndDelete(id);
    return brandDeleted
      ? res.status(200).json({
          message: "Brand deleted successfully",
          data: brandDeleted,
        })
      : res.status(404).json({ message: "Brand not found by this ID" });
  } catch (error) {
    console.error({ message: "Error deleting brand", error: error.message });
    res.status(500).json({ message: "Error deleting brand from the database" });
  }
};
