import bcrypt from "bcrypt";
import Users from "../model/userModel.js";
export const register = async (req, res, next) => {
  try {
    const { password, email, username } = req.body;

    const usernameCheck = await Users.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await Users.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "E-Mail already used", status: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      email,
      username,
      password: hashPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const { password, username } = req.body;

    const user = await Users.findOne({ username });
    if (!user) {
      return res.json({
        msg: "Incorrect Username or Password!",
        status: false,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        msg: "Incorrect Username or Password!",
        status: false,
      });
    }
    await delete user.password;
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await Users.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    return res.json(users);
  } catch (err) {
    next(err);
  }
};
