import Cart from "../../../../database/models/Cart.js";
import Coupon from "../../../../database/models/Coupon.js";
import Product from "../../../../database/models/product.model.js";

const calcPrice = async (cart) => {
  // Calculate subtotal by summing up the price * quantity for each product
  const subTotal = cart.products.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  cart.subTotal = subTotal;

  // Apply discount code if provided
  if (cart.discount) {
    cart.totalPrice = subTotal - (subTotal * cart.discount) / 100;
  } else {
    cart.totalPrice = subTotal;
  }

  await cart.save();
};

// Get all carts
export const getCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find();
    return res.json({
      message: "carts retrieved successfully",
      cartsCount: carts.length,
      data: carts,
    });
  } catch (error) {
    console.error({
      message: "Error fetching carts",
      error: error.message,
    });
    res.status(500).json({ message: "Error fetching carts from the database" });
  }
};

// Get a specific Cart by ID
export const getUserCart = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const cart = await Cart.findOne({ user: _id });
    return cart
      ? res.status(200).json({
          message: "cart retrieved successfully",
          productsCountInCart: cart.products.length,
          data: cart,
        })
      : res.status(404).json({ message: "cart not found by this ID" });
  } catch (error) {
    console.error({
      message: "Error fetching cart",
      error: error.message,
    });
    res.status(500).json({ message: "Error fetching cart from the database" });
  }
};

// Add a new cart
export const addCart = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { product: productId, quantity } = req.body;

    // Find the cart for the user
    let cart = await Cart.findOne({ user: _id });

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if there is enough stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Create a new cart if it doesn't exist
    if (!cart) {
      if (product.priceAfterDiscount) {
        product.price = product.priceAfterDiscount;
      }

      cart = await Cart.create({
        user: _id,
        products: [{ product: productId, quantity, price: product.price }],
      });
      calcPrice(cart);
      return res.status(201).json({
        message: "Cart created successfully",
        productsCountInCart: cart.products.length,
        data: cart,
      });
    }

    // Check if the product is already in the cart
    const existingProduct = cart.products.find(
      (pro) => pro.product.toString() === productId
    );

    if (existingProduct) {
      // Check if adding the quantity exceeds stock
      if (product.stock < existingProduct.quantity + quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      // Update the quantity of the existing product
      existingProduct.quantity += quantity;
    } else {
      // Add the product to the cart if it's not already there
      cart.products.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
    // Save the updated cart
    await cart.save();
    calcPrice(cart);

    return res.status(200).json({
      message: "Cart updated successfully",
      productsCountInCart: cart.products.length,
      data: cart,
    });
  } catch (error) {
    console.error({
      message: "Error creating/updating cart",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error creating/updating cart in the database" });
  }
};
//applyCoupon in cart
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    // Find the coupon that is valid and not expired
    const coupon = await Coupon.findOne({ code, expire: { $gt: Date.now() } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or expired" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Apply the discount from the coupon
    cart.discount = coupon.discount;

    // Calculate the new total price after applying the discount
    // Save the updated cart
    await calcPrice(cart);

    return res.status(200).json({
      message: "Discount applied successfully",
      productsCountInCart: cart.products.length,
      data: cart,
    });
  } catch (error) {
    console.error({ message: "Error applying coupon", error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};
//delete Product From Cart
export const deleteProductCart = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const cart = await Cart.findOneAndUpdate(
      { user: _id },
      { $pull: { products: { product: req.params.id } } },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    await calcPrice(cart);
    return res.status(200).json({
      message: "Deleted product successfully",
      productsCountInCart: cart.products.length,
      data: cart,
    });
  } catch (error) {
    console.error({ message: "Error applying coupon", error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a Cart by ID
export const updateQuantityforProductINCart = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { quantity, productId } = req.body;
    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingProduct = cart.products.find(
      (pro) => pro.product == productId
    );
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    existingProduct.quantity = quantity;

    await calcPrice(cart);
    return res.status(200).json({
      message: "Quantity updated successfully",
      productsCountInCart: cart.products.length,
      data: cart,
    });
  } catch (error) {
    console.error({ message: "Error applying coupon", error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a cart by ID
export const deleteCart = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const cartDeleted = await Cart.findOneAndDelete(_id);
    return cartDeleted
      ? res.status(200).json({
          message: "Cart deleted successfully",
          data: cartDeleted,
        })
      : res.status(404).json({ message: "Cart not found by this ID" });
  } catch (error) {
    console.error({ message: "Error deleting Cart", error: error.message });
    res.status(500).json({ message: "Error deleting Cart from the database" });
  }
};
