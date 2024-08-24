import Cart from "../../../../database/models/Cart.js";
import Order from "../../../../database/models/Order.model.js";
import Product from "../../../../database/models/product.model.js";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51PrGynBHazXVnQLC2RhpkpFeP04QbzWQYLiIVqgMR0kPN2V8stup0zddhKsH8sUeYjO6SIsTi6QAqWnur5ymEm3L008YlKyS3g");

// Get all orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.json({
      message: "Orders retrieved successfully",
      orderCount: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error({
      message: "Error fetching orders",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching orders from the database" });
  }
};

// Get a specific order by ID
export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found by this ID" });
    }
    return res
      .status(200)
      .json({ message: "Order retrieved successfully", data: order });
  } catch (error) {
    console.error({
      message: "Error fetching order",
      error: error.message,
    });
    res.status(500).json({ message: "Error fetching order from the database" });
  }
};

// Add a new order
export const addOrder = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { address, phone } = req.body;
    const cart = await Cart.findOne({ user: _id });

    if (!cart) {
      return res.status(409).json({ message: "Cart not found" });
    }
    if (!cart.products.length) {
      return res.status(400).json({ message: "No products found in cart" });
    }

    // Check product availability and stock
    for (const element of cart.products) {
      const product = await Product.findById(element.product);
      if (!product) {
        return res
          .status(409)
          .json({ message: `Product ${element.product} not found` });
      }
      if (product.stock < element.quantity) {
        return res.status(409).json({
          message: `Product ${element.product} not valid in stock, available stock ${product.stock}`,
        });
      }
    }

    // Update the stock and sold quantities
    for (const element of cart.products) {
      await Product.findByIdAndUpdate(element.product, {
        $inc: { sold: element.quantity, stock: -element.quantity },
      });
    }

    // Create the order
    const order = await Order.create({
      user: _id,
      products: cart.products,
      totalPrice: cart.totalPrice,
      address,
      phone,
    });

    // Delete the cart
    await Cart.findOneAndDelete({ user: _id });

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error({ message: "Error creating order", error: error.message });
    res.status(500).json({ message: "Error creating order in the database" });
  }
};

// Delete an order by ID
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    const orderDeleted = await Order.findByIdAndDelete(id);
    return orderDeleted
      ? res.status(200).json({
          message: "Order deleted successfully",
          data: orderDeleted,
        })
      : res.status(404).json({ message: "Order not found by this ID" });
  } catch (error) {
    console.error({ message: "Error deleting order", error: error.message });
    res.status(500).json({ message: "Error deleting order from the database" });
  }
};
// Cred order by Stripe
export const checkOutSession = async (req, res, next) => {
  try {
    const id = req.user._id;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the order associated with the user
    const order = await Order.findById(req.params._id);
    if (!order) {
      return res.status(404).json({ message: "Order not found for this user" });
    }

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Specify payment methods
      line_items: [
        {
          price_data: {
            currency: "EGP", // Correct currency code
            unit_amount: order.totalPrice * 100, // Amount in cents (or the smallest currency unit)
            product_data: {
              name: `Order #${order._id}`, // Name of the product or order
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      cancel_url: req.query.url,
      success_url: req.query.url,
      customer_email: req.user.email,
      client_reference_id: id.toString(),
      metadata: {
        address: req.body.address || "No address provided",
        phone: req.body.phone || "No phone provided",
        city: req.body.city || "No city provided",
      },
    });

    res.status(200).json({ message: "Success", data: session });
  } catch (error) {
    console.error({
      message: "Error creating checkout session",
      error: error.message,
    });
    res.status(500).json({ message: "Error creating checkout session" });
  }
};
