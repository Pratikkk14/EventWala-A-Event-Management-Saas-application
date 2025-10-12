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
    let updateData = {};

    // Only allow specific fields to be updated
    if (req.body.userData) {

      const parsed = JSON.parse(req.body.userData);
      console.log("Parsed userData:", parsed);

      // Whitelist allowed fields
      const allowedFields = [
        "email",
        "firstName",
        "lastName",
        "phone",
        "dateOfBirth",
        "gender",
        "address",
        "socialProfiles",
        "preferences",
        "role",
        "isVerified",
        "accountStatus",
        "accountType",
        "socialProfiles",
        "eventsHosted",
        "eventsAttended",
        "bookmarks",
        "guests",
        "defaultPaymentMethod",
        "avatar",
      ];
      allowedFields.forEach((field) => {
        if (parsed[field] !== undefined) {
          updateData[field] = parsed[field];
        }
      });
    }

    // // Add avatar data if file was uploaded
    // if (req.file) {
    //   updateData.avatar = {
    //     data: req.file.buffer,
    //     contentType: req.file.mimetype,
    //   };
    //   console.log("Avatar buffer length:", req.file?.buffer?.length);
    // }

    // Prevent updating UID or other sensitive fields
    delete updateData.uid;
    delete updateData._id;

    const user = await User.findOneAndUpdate({ uid }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
      ...user.toObject(),
      avatar: user.avatar
        ? {
          url: user.avatar.url || "",
          fileName: user.avatar.fileName || "",
          fileId: user.avatar.fileId || "",
        }
        : {
          url: "",
          fileName: "",
          fileId: "",
        },
      },
    });
  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating user profile",
    });
  }
};

module.exports = {
  createUser,
  updateUser,
};
