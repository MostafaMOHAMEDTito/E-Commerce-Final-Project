import Wishlist from "../../../../database/models/Wishlist.js";
import Coupon from "../../../../database/models/Coupon.js";
import Product from "../../../../database/models/product.model.js";

// Calculate the total price of items in the wishlist
const calcWishlistPrice = async (wishlist) => {
  // Calculate the subtotal by summing up the price for each product in the wishlist
  const subTotal = wishlist.products.reduce((total, item) => {
    return total + item.price;
  }, 0);

  wishlist.subTotal = subTotal;

  // Apply discount code if provided
  if (wishlist.discount) {
    wishlist.totalPrice = subTotal - (subTotal * wishlist.discount) / 100;
  } else {
    wishlist.totalPrice = subTotal;
  }

  await wishlist.save();
};

// Get all wishlists
export const getWishlists = async (req, res, next) => {
  try {
    const wishlists = await Wishlist.find();
    return res.json({
      message: "Wishlists retrieved successfully",
      wishlistsCount: wishlists.length,
      data: wishlists,
    });
  } catch (error) {
    console.error({
      message: "Error fetching wishlists",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching wishlists from the database" });
  }
};

// Get a specific Wishlist by ID
export const getUserWishlist = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const wishlist = await Wishlist.findOne({ user: _id });
    return wishlist
      ? res.status(200).json({
          message: "Wishlist retrieved successfully",
          productsCountInWishlist: wishlist.products.length,
          data: wishlist,
        })
      : res.status(404).json({ message: "Wishlist not found by this ID" });
  } catch (error) {
    console.error({
      message: "Error fetching wishlist",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching wishlist from the database" });
  }
};

// Add a new item to the wishlist
export const addWishlistItem = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { product: productId } = req.body;

    // Find the wishlist for the user
    let wishlist = await Wishlist.findOne({ user: _id });

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: _id,
        products: [{ product: productId, price: product.price }],
      });
      calcWishlistPrice(wishlist);
      return res.status(201).json({
        message: "Wishlist created successfully",
        productsCountInWishlist: wishlist.products.length,
        data: wishlist,
      });
    }

    // Check if the product is already in the wishlist
    const existingProduct = wishlist.products.find(
      (pro) => pro.product.toString() === productId
    );

    if (existingProduct) {
      return res.status(400).json({ message: "Product already in wishlist" });
    } else {
      // Add the product to the wishlist if it's not already there
      wishlist.products.push({
        product: productId,
        price: product.price,
      });
    }
    // Save the updated wishlist
    await wishlist.save();
    calcWishlistPrice(wishlist);

    return res.status(200).json({
      message: "Wishlist updated successfully",
      productsCountInWishlist: wishlist.products.length,
      data: wishlist,
    });
  } catch (error) {
    console.error({
      message: "Error creating/updating wishlist",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error creating/updating wishlist in the database" });
  }
};

// Apply a coupon to the wishlist
export const applyWishlistCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    // Find the coupon that is valid and not expired
    const coupon = await Coupon.findOne({ code, expire: { $gt: Date.now() } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or expired" });
    }

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Apply the discount from the coupon
    wishlist.discount = coupon.discount;

    // Calculate the new total price after applying the discount
    await calcWishlistPrice(wishlist);

    return res.status(200).json({
      message: "Discount applied successfully",
      productsCountInWishlist: wishlist.products.length,
      data: wishlist,
    });
  } catch (error) {
    console.error({ message: "Error applying coupon", error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a product from the wishlist
export const deleteWishlistItem = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: _id },
      { $pull: { products: { product: req.params.id } } },
      { new: true }
    );
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    await calcWishlistPrice(wishlist);
    return res.status(200).json({
      message: "Deleted product from wishlist successfully",
      productsCountInWishlist: wishlist.products.length,
      data: wishlist,
    });
  } catch (error) {
    console.error({
      message: "Error deleting product from wishlist",
      error: error.message,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update the quantity of a product in the wishlist (if applicable)
export const updateQuantityforProductInWishlist = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { quantity, productId } = req.body;
    const wishlist = await Wishlist.findOne({ user: _id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingProduct = wishlist.products.find(
      (pro) => pro.product == productId
    );
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
    existingProduct.quantity = quantity;

    await calcWishlistPrice(wishlist);
    return res.status(200).json({
      message: "Quantity updated successfully",
      productsCountInWishlist: wishlist.products.length,
      data: wishlist,
    });
  } catch (error) {
    console.error({
      message: "Error updating product quantity in wishlist",
      error: error.message,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a wishlist by ID
export const deleteWishlist = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const wishlistDeleted = await Wishlist.findOneAndDelete({ user: _id });
    return wishlistDeleted
      ? res.status(200).json({
          message: "Wishlist deleted successfully",
          data: wishlistDeleted,
        })
      : res.status(404).json({ message: "Wishlist not found by this ID" });
  } catch (error) {
    console.error({ message: "Error deleting wishlist", error: error.message });
    res
      .status(500)
      .json({ message: "Error deleting wishlist from the database" });
  }
};
