const express = require("express");
const upload = require("./../config/upload");
const { User, userValidator } = require("./../models/user_model");
const auth = require("./../config/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const route = express.Router();
const nodemailer = require("nodemailer");
const { totp } = require("otplib");
totp.options = { step: 60, digits: 6 };

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

route.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = totp.generate(email + process.env.OTP_SECRET_KEY || "birnima");
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verification",
      text: `your otp code ${otp}`,
    });
    res.json({ message: `Otp sent to ${email}` });
  } catch (e) {
    res.json(e);
  }
});

route.post("/verify-otp", async (req, res) => {
  let { otp, email } = req.body;
  const verify = totp.check(
    otp,
    email + process.env.OTP_SECRET_KEY || "birnima"
  );
  res.json({ verify });
});

route.post("/register", async (req, res) => {
  try {
    let { value, error } = userValidator.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const exists = await User.findOne({ name: value.name });
    if (exists) {
      return res.status(409).send({ error: "User already exists" });
    }

    const hash = bcrypt.hashSync(value.password, 10);
    const user = new User({ ...value, password: hash });

    await user.save();

    res.status(201).send({ message: "Registered successfully", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).send({ error: "Name and password required" });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).send({ error: "Login error" });
    }

    const compare = bcrypt.compareSync(password, user.password);
    if (!compare) {
      return res.status(401).send({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY || "nimadur",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).send({ message: "Welcome", token, user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

route.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

route.post("/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send({ message: "Image required" });
  res.status(200).send({ filename: req.file.filename });
});

module.exports = route;
