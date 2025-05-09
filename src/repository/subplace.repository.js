const subplaceModel = require("../models/subplace.model");
const userModel = require("../models/user.model");
const userRepository = require("./../repository/user.repository");

const createSubplace = async (subplaceData) => {
  try {
    const subplace = new subplaceModel(subplaceData);
    await subplace.save();
    return subplace;
  } catch (error) {
    throw new Error("Chyba pri vytváraní subplace: " + error.message);
  }
};

const getAllSubplaces = async (req, res) => {
  try {
    const subplaces = await subplaceModel
      .find()
      .populate("moderators", "name")
      .populate("creator", "name")
      .populate("questions", "title")
      .populate("membersids", "name");
    return subplaces;
  } catch (error) {
    throw new Error("Chyba pri získavaní všektých subplaces: " + error.message);
  }
};

const getSubplaceById = async (subplaceid) => {
  try {
    const subplace = await subplaceModel
      .findById(subplaceid)
      .populate("membersids", "name")
      .populate("creator", "name")
      .populate("moderators", "name")
      .populate("questions", "title");
    if (!subplace) {
      return res.status(404).json({ message: "Subplace not found" });
    }
    return subplace;
  } catch (error) {
    throw new Error("Chyba pri získavaní subplace: " + error.message);
  }
};

const getSubplaceByName = async (subplacename) => {
  try {
    const subplace = await subplaceModel
      .findOne({ name: subplacename })
      .populate("membersids", "name")
      .populate("creator", "name")
      .populate("moderators", "name")
      .populate("questions", "title");
    return subplace;
  } catch (error) {
    throw new Error("Chyba pri hľadaní subplace podľa mena" + error.message);
  }
};

const updateSubplace = async (subplaceid, subplaceData) => {
  try {
    const subplace = await subplaceModel
      .findByIdAndUpdate(subplaceid, subplaceData, { new: true })
      .populate("membersids", "name")
      .populate("creator", "name")
      .populate("moderators", "name")
      .populate("questions", "title");
    if (!subplace) {
      throw new Error("Subplace neboj nájdený");
    }
    return subplace;
  } catch (error) {
    throw new Error("Chyba pri aktualizovaní subplace: " + error.message);
  }
};

const deleteSubplace = async (subplaceid) => {
  try {
    const subplace = await subplaceModel.findByIdAndDelete(subplaceid);
    if (!subplace) {
      throw new Error("Subplace neboj nájdený");
    }
    return subplace;
  } catch (error) {
    throw new Error("Chyba pri vymazavaní subplace: " + error.message);
  }
};

const updateModerators = async (userid, subplaceid) => {
  try {
    if (!userid || !subplaceid) {
      throw new Error("Neautorizovaný prístup");
    }
    const moderators = await subplaceModel
      .findByIdAndUpdate(
        subplaceid,
        { $addToSet: { moderators: userid } },
        { new: true }
      )
      .populate("membersids", "name")
      .populate("creator", "name")
      .populate("moderators", "name")
      .populate("questions", "title");
    return moderators;
  } catch (error) {
    throw new Error("Chyba pri aktualizovaní moderatórov " + error.message);
  }
};

const deletemoderator = async (userid, subplaceid) => {
  try {
    if (!userid || !subplaceid) {
      throw new Error("Neautorizovaný prístup");
    }
    const moderators = await subplaceModel
      .findByIdAndUpdate(
        subplaceid,
        { $pull: { moderators: userid } },
        { new: true }
      )
      .populate("membersids", "name")
      .populate("creator", "name")
      .populate("moderators", "name")
      .populate("questions", "title");
    return moderators;
  } catch (error) {
    throw new Error("Chyba pri aktualizovaní moderátorov " + error.message);
  }
};

const updateQuestions = async (questionid, subplaceid) => {
  try {
    const updateQuestions = await subplaceModel.findByIdAndUpdate(
      subplaceid,
      { $addToSet: { questions: questionid } },
      { new: true }
    );
    if (!updateQuestions) {
      throw new Error(
        "Chyba pri aktualizovaní otázky pre subplace " + error.message
      );
    }
  } catch (error) {
    throw new Error(
      "Chyba pri aktualizovaní otázky pre subplace " + error.message
    );
  }
};

const deleteQuestion = async (questionid, subplaceid) => {
  try {
    const updateQuestions = await subplaceModel.findByIdAndUpdate(
      subplaceid,
      { $pull: { questions: questionid } },
      { new: true }
    );
    if (!updateQuestions) {
      throw new Error(
        "Chyba pri aktualizovaní otázky pre subplace " + error.message
      );
    }
  } catch (error) {
    throw new Error(
      "Chyba pri aktualizovaní otázky pre subplace " + error.message
    );
  }
};

const checkIfUserInSubplace = async (memberid, subplaceid) => {
  try {
    const user = await userRepository.getUserById(memberid);
    if (!user) {
      throw new Error("Chyba pri získavaní používateľa");
    }
    const subplace = await subplaceModel.findById(subplaceid);
    if (!subplace) {
      throw new Error("Chyba pri získavaní subplace");
    }
    const foudnuser = subplace.membersids.some(
      (id) => id.toString() === memberid.toString()
    );
    if (!foudnuser) {
      return null;
    }
    return foudnuser;
  } catch (error) {
    throw new Error(
      "Chyba pri aktualizovaní členov subplaces " + error.message
    );
  }
};

const updateMembers = async (memberid, subplaceid) => {
  try {
    const subplace = await subplaceModel.findByIdAndUpdate(
      subplaceid,
      { $addToSet: { membersids: memberid } },
      { new: true }
    );
  } catch (error) {
    throw new Error(
      "Chyba pri aktualizovaní členov subplaces " + error.message
    );
  }
};

const deleteMember = async (memberid, subplaceid) => {
  try {
    const subplace = await subplaceModel.findByIdAndUpdate(
      subplaceid,
      { $pull: { membersids: memberid } },
      { new: true }
    );
    const user = await userModel.findByIdAndUpdate(
      memberid,
      { $pull: { subplaces: subplaceid } },
      { new: true }
    );
    if (!subplace) {
      throw new Error("Subplace neexistuje");
    }
    await subplaceModel.findByIdAndUpdate(
      subplaceid,
      { $set: { members: subplace.membersids.length } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Chyba pri vymazavaní požívateľa zo subplace");
  }
};

const getAllQuestions = async (subplaceid) => {
  try {
    const subplace = await subplaceModel.findById(subplaceid);
    if (!subplace) {
      throw new Error("Subplace neboj nájdený alebo neexistuje");
    }
    const questions = subplace.questions;
    return questions;
  } catch (error) {
    throw new Error("Chyba pri získavaní otázok: " + error.message);
  }
};

const checkIfUserIsCreator = async (userid, subplaceid) => {
  try {
    const subplace = await subplaceModel.findById(subplaceid);
    console.log(subplace);

    if (!subplace) {
      throw new Error("Subplace neexistuje");
    }
    const isCreator = subplace.creator._id.toString() === userid.toString();
    return isCreator;
  } catch (error) {
    throw new Error("Chyba pri kontrole vlastníka subplaces: " + error.message);
  }
};

const subplacesFeed = async (skip = 0, limit = 10) => {
  try {
    const subplaces = await subplaceModel
      .find()
      .populate("moderators", "name")
      .populate("creator", "name")
      .populate("questions", "title")
      .populate("membersids", "name")
      .skip(skip)
      .limit(limit);

    const subplacesFeed = subplaces.sort(() => Math.random() - 0.5);
    return subplacesFeed;
  } catch (error) {
    throw new Error("Chyba pri získavaní subplaces: " + error.message);
  }
};

const getSubplaceTags = async (subplaceid) => {
  try {
    const subplace = await subplaceModel.findById(subplaceid);
    if (!subplace) {
      throw new Error("Subplace neexistuje");
    }
    return subplace.tags;
  } catch (error) {
    throw new Error("Chyba pri získavaní tagov subplaces: " + error.message);
  }
};

module.exports = {
  createSubplace,
  getAllSubplaces,
  getSubplaceById,
  updateSubplace,
  deleteSubplace,
  updateModerators,
  getSubplaceByName,
  updateQuestions,
  updateMembers,
  checkIfUserInSubplace,
  deleteMember,
  deletemoderator,
  deleteQuestion,
  getAllQuestions,
  checkIfUserIsCreator,
  subplacesFeed,
  getSubplaceTags,
};
