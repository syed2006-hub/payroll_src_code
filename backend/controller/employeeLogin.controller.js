import User from "../models/Usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* 1️⃣ Basic validation */
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    /* 2️⃣ Find user */
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(404).json({
        message: "No employee account found"
      });
    }

    /* 3️⃣ Check portal access */
    const enablePortal =
      user.employeeDetails?.basic?.enablePortal === true;

    if (!enablePortal) {
      return res.status(403).json({
        message: "Employee portal access is disabled. Contact HR."
      });
    }

    /* 4️⃣ Password verification */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    /* 5️⃣ Create JWT */
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,                 // keep REAL role
        organizationId: user.organizationId,
        portal: "employee"           // 👈 IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* 6️⃣ Response */
    res.status(200).json({
      message: "Employee login successful",
      token,
      user: {
        ...user,
        portal: "employee", 
      }
    });

  } catch (error) {
    console.error("Employee login error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
