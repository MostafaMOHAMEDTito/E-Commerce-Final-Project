import slugify from "slugify";
import Product from "../../../../database/models/product.model.js";
import fs from "fs";

// Get all Products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error({
      message: "Error fetching products",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching products from the database" });
  }
};

// Get a specific Product by ID
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id).populate([
      { path: "category", select: ["name", "slug"] },
      { path: "brand", select: ["name", "slug"] },
      { path: "subCategory", select: ["name", "slug"] },
    ]);
    if (!product) {
      return res.status(404).json({ message: "Product not found by this ID" });
    }
    return res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error({
      message: "Error fetching product",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching product from the database" });
  }
};

// Add a new Product
export const addProduct = async (req, res, next) => {
  try {
    const { title } = req.body;
    let slug = "";
    if (title) {
      slug = slugify(title, { lower: true, trim: true });
    }
    const mainImage = req.files.mainImage
      ? req.files.mainImage[0].filename
      : null;
    const coverImage = req.files.coverImage
      ? req.files.coverImage.map((file) => file.filename)
      : [];

    const product = await Product.create({
      ...req.body,
      slug,
      mainImage,
      coverImage,
    });
    return res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error({ message: "Error creating product", error: error.message });
    res.status(500).json({ message: "Error creating product in the database" });
  }
};

// Update a Product by ID
// export const updateProduct = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { title } = req.body;
//     if (!id) {
//       return res.status(400).json({ message: "Product ID is required" });
//     }
//     if (!title) {
//       return res.status(400).json({ message: "Title is required for update" });
//     }
//     const slug = slugify(title, { lower: true, trim: true });
//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found by this ID" });
//     }
//     console.log(product);
//     console.log(req.files);
//     const mainImage = req.files.mainImage
//       ? req.files.mainImage.filename
//       : product.mainImage;
//     console.log(mainImage);
//     const coverImage = req.files?.coverImage
//       ? req.files.coverImage.map((file) => file.filename)
//       : product.coverImage;
//     console.log(coverImage);
//     // if (req.files.mainImage) {
//     //   fs.unlink(`./uploads/product/${product.mainImage}`, (err) => {
//     //     if (err) {
//     //       console.error({ message: 'Error deleting old main image', error: err.message });
//     //     }
//     //   });
//     // }

//     // if (req.files.coverImage) {
//     //   product.coverImage.forEach((image) => {
//     //     fs.unlink(`./uploads/product/${image}`, (err) => {
//     //       if (err) {
//     //         console.error({ message: 'Error deleting old cover image', error: err.message });
//     //       }
//     //     });
//     //   });
//     // }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { ...req.body, slug, mainImage, coverImage },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Product updated successfully",
//       data: updatedProduct,
//     });
//   } catch (error) {
//     console.error({ message: "Error updating product", error: error.message });
//     res.status(500).json({ message: "Error updating product in the database" });
//   }
// };

// Delete a Product by ID
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const productDeleted = await Product.findByIdAndDelete(id);
    return productDeleted
      ? res.status(200).json({
          message: "Product deleted successfully",
          data: productDeleted,
        })
      : res.status(404).json({ message: "Product not found by this ID" });
  } catch (error) {
    console.error({ message: "Error deleting product", error: error.message });
    res
      .status(500)
      .json({ message: "Error deleting product from the database" });
  }
};
