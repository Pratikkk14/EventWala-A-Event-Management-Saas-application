const User = require("../Models/users");
const multer = require("multer");
const path = require("path");


const createUser = async (req, res) => {
  try {
    const { uid, email } = req.body;
    let { firstName, lastName } = req.body;
    console.log("Req body:", req.body);
    // If firstName is missing or empty, use email prefix
    if (!firstName || firstName.trim() === "") {
      firstName = email ? email.split("@")[0] : "User";
    }
    // If lastName is missing, set to empty string
    if (!lastName) {
      lastName = "";
    }

    console.log("First Name:", firstName, "Last Name:", lastName);

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.json({ success: true, user: existingUser });
    }
    // Create new user
    const user = new User({
      uid,
      email,
      firstName,
      lastName,
    });

    await user.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({
      success: false,
      message:
        "Internal server error near user creation at the auth form or user profile",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log("Updating user:", uid);
    console.log("Request body:", req.body);

    const updateData = { ...req.body };
    
    // Prevent updating sensitive fields
    delete updateData.uid;
    delete updateData._id;
    delete updateData.role;
    delete updateData.isVerified;
    delete updateData.accountStatus;
    delete updateData.accountType;

    console.log("Filtered update data:", updateData);

    // Find and update the user
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Updated user:", updatedUser);

    // Send back the updated user data
    res.status(200).json({
      success: true,
      user: updatedUser.toObject()
    });

  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating user profile",
      error: error.message
    });
  }
};

module.exports = {
  createUser,
  updateUser,
};
