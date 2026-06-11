const UserModel = require("../Models/user");

exports.register = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(req.body);
    const UserExist = await UserModel.findOne({ email: email });
    if (!UserExist) {
      let newUser = new UserModel({ name, email });
      await newUser.save();
      return res.status(200).json({
        message: "Registered Succesfully!!",
        user: newUser,
      });
    }

    return res.status(200).json({
      message: "Welcome Back!!",
      user: UserExist,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};
