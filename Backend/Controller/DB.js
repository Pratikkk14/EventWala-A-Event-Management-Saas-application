const User = require("../Models/users");
const multer = require("multer");
const path = require("path");


const createUser = async (req, res) => {
  try {
    const { uid, email, firstName, lastName } = req.body;

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
      ];
      allowedFields.forEach((field) => {
        if (parsed[field] !== undefined) {
          updateData[field] = parsed[field];
        }
      });
    }

    // Add avatar data if file was uploaded
    if (req.file) {
      updateData.avatar = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      console.log("Avatar buffer length:", req.file?.buffer?.length);
    }

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
        avatar:
          user.avatar && user.avatar.data
            ? {
                contentType: user.avatar.contentType,
                url: `data:${
                  user.avatar.contentType
                };base64,${user.avatar.data.toString("base64")}`,
              }
            : null,
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

const upload = multer({
  limits: {
    fieldSize: 5 * 1024 * 1024, // 5MB for text fields
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

module.exports = {
  createUser,
  updateUser,
  upload,
};