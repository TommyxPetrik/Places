const userModel = require("../models/user.model");
const multer = require("multer");
const {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  checkUserPassword,
  updateUserSubplaces,
} = require("../../src/repository/user.repository");
const jwt = require("jsonwebtoken");
const placeRepository = require("./../repository/place.repository");
const userRepository = require("../repository/user.repository");

const { fileFilter, storage } = require("../utils/fileUpload");

let upload = multer({ storage, fileFilter, limits: { fileSize: "20MB" } });

const createUserController = async (req, res) => {
  try {
    const checkemail = await getUserByEmail(req.body.email);
    if (checkemail !== null) {
      res.status(400).json("Email už je registrovaný");
    }
    const user = await userRepository.createUser(req.body);
    await placeRepository.updateUsers(user._id);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUserController = async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).json({ error: "Používateľ neexistuje" });
    }

    const matchedpassword = checkUserPassword(
      req.body.password,
      user.password,
      user.salt
    );
    if (!matchedpassword) {
      return res.status(400).json({ error: "Nesprávne heslo" });
    }

    const token = jwt.sign(
      {
        userid: user.id,
        username: user.name,
        userrole: user.userrole,
      },
      process.env.API_KEY
    );

    res.status(200).send({
      token,
      email: user.email,
      id: user.id,
      role: user.userrole,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Chyba pri získavaní používateľov:", error.message);
    res.status(500).json({ message: "Chyba pri získavaní používateľov" });
  }
};

const getUserController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Užívateľ nenájdený" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserByUsernameController = async (req, res) => {
  try {
    const user = await getUserByUsername(req.params.username);
    if (!user) {
      res.status(404).json({ message: "Užívateľ nenájdený" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUserController = async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: "Užívateľ nenájdený" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changeUsernameController = async (req, res) => {
  try {
    const user = await userRepository.changeUsername(
      req.params.id,
      req.body.name
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUserController = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ message: "Užívateľ bol úspešne odstránený" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserVotesController = async (req, res) => {
  try {
    const votes = await userRepository.getUserVotes(req.user.userid);
    res.status(200).json(votes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getJoinedSubplacesController = async (req, res) => {
  try {
    const subplaces = await userRepository.getJoinedSubplaces(req.user.userid);
    if (!subplaces) {
      res.status(404).json({ message: "Užívateľ nenájdený" });
    }
    res.status(200).json(subplaces);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getJoinedSubplacesIdController = async (req, res) => {
  try {
    const subplaces = await userRepository.getJoinedSubplacesId(
      req.user.userid
    );
    res.status(200).json(subplaces);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadProfilePictureController = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    try {
      const userId = req.user.userid;
      let imageLocation = "";

      if (req.file && req.file.path) {
        imageLocation = req.file.path.replace(/\\/g, "/");
        imageLocation = imageLocation.slice(imageLocation.indexOf("images/"));
      }

      const user = await userRepository.updateUserProfilePicture(
        userId,
        imageLocation
      );
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  });
};

const deleteProfilePictureController = async (req, res) => {
  try {
    const userId = req.user.userid;
    const updatedUser = await userRepository.deleteUserProfilePicture(userId);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, password } = req.body;
    const userId = req.user.userid;
    const user = await userRepository.getUserById(userId);
    if (!user) res.status(404).json({ message: "User not found" });

    const isMatch = user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = password;
    user.password_repeat = password;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Server error while updating password" });
  }
};

module.exports = {
  createUserController,
  getUserController,
  getUserByUsernameController,
  updateUserController,
  deleteUserController,
  getAllUsersController,
  loginUserController,
  getUserVotesController,
  getJoinedSubplacesController,
  getJoinedSubplacesIdController,
  uploadProfilePictureController,
  deleteProfilePictureController,
  uploadProfilePictureController,
  deleteProfilePictureController,
  changePassword,
  changeUsernameController,
};
