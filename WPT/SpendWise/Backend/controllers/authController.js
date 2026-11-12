const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// USER REGISTRATION
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone_no } = req.body;

    if (!username || !email || !password || !phone_no) {
      return res.status(400).json({ //400 bad request
        message: "Please fill all required fields"
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      phone_no,
      password: hashedPassword
    });

    res.status(201).json({  //201 means created
      message: "Registration successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone_no: newUser.phone_no,
        role: newUser.role
      }
    });

  } catch (error) {  //500 internal server error
    res.status(500).json({
      message: error.message
    });
  }
};


// USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(404).json({   //404 not found
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // CHECK IF USER IS BLOCKED
    if (user.isBlocked === true) {
      return res.status(403).json({   //refuse
        success: false,
        message: "Your account has been blocked by the administrator. Please contact support."
      });
    }

    // GENERATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone_no: user.phone_no,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// UPDATE USER PROFILE
const updateProfile = async (req, res) => {
  try {
    const { username, email, phone_no } = req.body;

    // Check required fields
    if (!username || !email || !phone_no) {
      return res.status(400).json({
        message: "All profile fields are required"
      });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address"
      });
    }

    // Check mobile number format
    if (!/^\+91[6-9]\d{9}$/.test(phone_no)) {
      return res.status(400).json({
        message: "Please enter a valid mobile number"
      });
    }

    // Check whether email belongs to another user
    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered with another account"
      });
    }

    // Update logged-in user's profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        phone_no: phone_no.trim()
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone_no: updatedUser.phone_no,
        role: updatedUser.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// EXPORT FUNCTIONS
module.exports = {
  registerUser,
  loginUser,
  updateProfile
};