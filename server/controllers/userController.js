import {Task, User} from '../models/index.js';
import { createJWT } from "../utils/index.js";
import { Op } from 'sequelize';

export const registerUser = async (req, res, isAdmin=false) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }
    const role = isAdmin?'admin':'user';
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    if (user) {
      isAdmin ? createJWT(res, user.id) : null;

      user.password = undefined;

      res.status(201).json(user);
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      createJWT(res, user.id);
      user.password = undefined;

      res.status(200).json(user);
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      htttpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const registerAdminUser = (req, res) => registerUser(req, res, true);

export const getUserList = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getMeUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

