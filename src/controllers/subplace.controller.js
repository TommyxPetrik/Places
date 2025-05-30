const subplaceRepository = require("./../repository/subplace.repository");
const userRepository = require("./../repository/user.repository");
const placeRepository = require("./../repository/place.repository");

const createSubplace = async (req, res) => {
  try {
    if (!req.user || !req.user.userid) {
      return res.status(401).json({ message: "Neautorizovaný prístup" });
    }

    const subplace = { ...req.body, creator: req.user.userid };
    await subplaceRepository.createSubplace(subplace);
    const subplaceDB = await subplaceRepository.getSubplaceByName(
      subplace.name
    );
    await subplaceRepository.updateModerators(req.user.userid, subplaceDB._id);
    await userRepository.updateUserSubplaces(req.user.userid, subplaceDB._id);
    await subplaceRepository.updateMembers(req.user.userid, subplaceDB._id);
    await placeRepository.updateSubplaces(subplaceDB._id);
    res.status(201).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSubplaces = async (req, res) => {
  try {
    const subplaces = await subplaceRepository.getAllSubplaces();
    if (!subplaces || subplaces == [] || subplaces.length === 0) {
      return res.status(400).json(" Neboli nájdené žiadne subplaces ");
    }
    return res.status(200).json(subplaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubplaceById = async (req, res) => {
  try {
    const subplace = await subplaceRepository.getSubplaceById(req.params.id);
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getByNameController = async (req, res) => {
  try {
    if (!req.query.name) {
      return res.status(400).json("Meno nieje spávne zadané ");
    }

    const subplace = await subplaceRepository.getSubplaceByName(req.query.name);
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubplace = async (req, res) => {
  try {
    const subplace = await subplaceRepository.updateSubplace(
      req.query.id,
      req.body
    );
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubplaceById = async (req, res) => {
  try {
    const subplace = await subplaceRepository.deleteSubplace(req.params.id);
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json({ message: "Subplace deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinSubplace = async (req, res) => {
  try {
    await subplaceRepository.updateMembers(
      req.user.userid,
      req.params.subplaceId
    );
    await userRepository.updateUserSubplaces(
      req.user.userid,
      req.params.subplaceId
    );
    res.status(200).json("Úspešne pridaný do subplace");
  } catch (error) {
    res
      .status(400)
      .json("Chyba pri pridaní požívateľa do subplace: " + error.message);
  }
};

const leaveSubplace = async (req, res) => {
  try {
    const isCreator = await subplaceRepository.checkIfUserIsCreator(
      req.user.userid,
      req.params.subplaceId
    );
    if (isCreator) {
      return res
        .status(400)
        .json("Nemôžeš opustiť subplace, pretože si jeho zakladateľ");
    }

    await subplaceRepository.deleteMember(
      req.user.userid,
      req.params.subplaceId
    );
    await userRepository.RemoveModerating(
      req.user.userid,
      req.params.subplaceId
    );
    res.status(200).json("Používateľ bol úspešne vymazaný");
  } catch (error) {
    res
      .status(400)
      .json("Chyba pri vymazavaní požívateľa zo subplace: " + error.message);
  }
};

const updateModerators = async (req, res) => {
  try {
    const subplace = await subplaceRepository.updateModerators(
      req.body.userId,
      req.body.subplaceId
    );
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteModerator = async (req, res) => {
  try {
    const subplace = await subplaceRepository.deletemoderator(
      req.body.userId,
      req.body.subplaceId
    );
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestions = async (req, res) => {
  try {
    const subplace = await subplaceRepository.updateQuestions(
      req.body.subplaceId,
      req.body.subplaceId
    );
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const subplace = await subplaceRepository.deleteQuestion(
      req.body.subplaceId,
      req.body.subplaceId
    );
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    res.status(200).json(subplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSubplaceQuestions = async (req, res) => {
  try {
    const questions = await subplaceRepository.getAllQuestions();
    return questions;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const subplacesFeedController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subplacesFeed = await subplaceRepository.subplacesFeed(skip, limit);

    return res.status(200).json(subplacesFeed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubplaceTagsController = async (req, res) => {
  try {
    const tags = await subplaceRepository.getSubplaceTags(req.params.id);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubplace,
  getAllSubplaces,
  getSubplaceById,
  updateSubplace,
  deleteSubplaceById,
  getByNameController,
  joinSubplace,
  leaveSubplace,
  updateModerators,
  deleteModerator,
  updateQuestions,
  deleteQuestion,
  getAllSubplaceQuestions,
  subplacesFeedController,
  getSubplaceTagsController,
};
