import bcrypt from "bcrypt";
import User from "../models/User.js";

export const signupUser = async (userData) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    address,
    location,
    state,
    district
  } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  //  Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }


  //  Create user
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
    address,
    location,
    state,
    district
  });

  return user;
};
