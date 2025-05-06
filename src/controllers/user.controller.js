const userModel = require("../models/user.model");
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

const createUserController = async (req, res) => {
  try {
    const checkemail = await getUserByEmail(req.body.email);
    if (checkemail) {
      return res.status(400).json("Email už je registrovaný");
    }
    const user = await createUser(req.body);
    await placeRepository.updateUsers(user.id);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUserController = async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return res.status(400).json("Používateľ neexistuje");
    }

    const matchedpassword = checkUserPassword(
      req.body.password,
      user.password,
      user.salt
    );
    if (!matchedpassword) {
      throw new Error("Nesprávne heslo");
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
    return res.status(200).json(users);
  } catch (error) {
    console.error("Chyba pri získavaní používateľov:", error.message);
    return res
      .status(500)
      .json({ message: "Chyba pri získavaní používateľov" });
  }
};

const getUserController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Užívateľ nenájdený" });
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
      return res.status(404).json({ message: "Užívateľ nenájdený" });
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
      return res.status(404).json({ message: "Užívateľ nenájdený" });
    }
    res.status(200).json(updatedUser);
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
    return res.status(200).json(votes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getJoinedSubplacesController = async (req, res) => {
  try {
    const subplaces = await userRepository.getJoinedSubplaces(req.user.userid);
    if (!subplaces) {
      return res.status(404).json({ message: "Užívateľ nenájdený" });
    }
    res.status(200).json(subplaces);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
};
