import Coupon from "../../../../database/models/Coupon.js";


// Get all Coupons
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    return res.json({
      message: "Coupons retrieved successfully",
      couponsCount : coupons.length,
      data: coupons,
    });
  } catch (error) {
    console.error({
      message: "Error fetching Coupons",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching Coupons from the database" });
  }
};

// Get a specific Coupon by ID
export const getCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Coupon ID is required" });
    }

    const Coupon = await Coupon.findById(id);
    if (!Coupon) {
      return res.status(404).json({ message: "Coupon not found by this ID" });
    }
    return res
      .status(200)
      .json({ message: "Coupon retrieved successfully", data: Coupon });
  } catch (error) {
    console.error({
      message: "Error fetching Coupon",
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Error fetching Coupon from the database" });
  }
};

// Add a new Coupon
export const addCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const existCode = await Coupon.findOne({ code });

    if (existCode) {
      return res.status(409).json({ message: "Coupon code  already exists" });
    }

    const coupon = await Coupon.create(req.body);
    return res.status(201).json({
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error) {
    console.error({ message: "Error creating coupon", error: error.message });
    res.status(500).json({ message: "Error creating coupon in the database" });
  }
};

// Delete a Coupon by ID
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Coupon ID is required" });
    }
    const CouponDeleted = await Coupon.findByIdAndDelete(id);
    return CouponDeleted
      ? res.status(200).json({
          message: "Coupon deleted successfully",
          data: CouponDeleted,
        })
      : res.status(404).json({ message: "Coupon not found by this ID" });
  } catch (error) {
    console.error({ message: "Error deleting Coupon", error: error.message });
    res
      .status(500)
      .json({ message: "Error deleting Coupon from the database" });
  }
};
