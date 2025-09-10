const User = require('../Models/users');

const profileController = async (req, res) => { 
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If user is found, return the user profile
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const isUserInDB = async (req, res) => {
  try {
    const { uid, email, displayName } = req.user; // req.user is set by authenticate
    let user = await User.findOne({ uid });
    if (!user) {
      // Add user Manually in mongodb if not exists
      user = await User.create({
        uid,
        email,
        firstName: displayName?.split(" ")[0] || "",
        lastName: displayName?.split(" ")[1] || "",
      });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { profileController, isUserInDB };