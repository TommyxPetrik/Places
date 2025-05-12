const userModel = require("../models/user.model");
const crypto = require("crypto");
const questionModel = require("../models/question.model");
const answerModel = require("../models/answer.model");

const getAllUsers = async () => {
  try {
    const users = await userModel.find().populate("subplaces", "name");
    return users;
  } catch (error) {
    throw new Error(
      "Chyba pri získavaní všetkých užívateľov: " + error.message
    );
  }
};

const getUserById = async (id) => {
  try {
    const user = await userModel
      .findById(id)
      .populate("subplaces", "name")
      .populate("moderator", "name");
    return user;
  } catch (error) {
    throw new Error("Chyba pri získavaní užívateľa: " + error.message);
  }
};

const deleteUser = async (id) => {
  try {
    const user = await userModel.findByIdAndDelete(id);
    return user;
  } catch (error) {
    throw new Error("Chyba pri mazani užívateľa: " + error.message);
  }
};

const getUserByUsername = async (name) => {
  try {
    const user = await userModel.findOne({ name: name });
    return user;
  } catch (error) {
    throw new Error(
      "Chyba pri získavaní užívateľa podľa username: " + error.message
    );
  }
};

const getUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("Email je undefined alebo null");
    }
    const user = await userModel.findOne({ email: email });
    return user;
  } catch (error) {
    throw new Error(
      "Chyba pri získavaní užívateľa podľa emailu " + error.message
    );
  }
};

const createUser = async (userData) => {
  try {
    const user = new userModel(userData);

    await user.save();
    return user;
  } catch (error) {
    throw new Error("Chyba pri vytváraní užívateľa: " + error.message);
  }
};

const updateUser = async (id, userData) => {
  try {
    const user = await userModel.findByIdAndUpdate(id, userData, { new: true });
    return user;
  } catch (error) {
    throw new Error("Chyba pri aktualizácii užívateľa: " + error.message);
  }
};

const changeUsername = async (id, newUsername) => {
  try {
    const user = await getUserById(id);
    if (!user) throw new Error("User not found");

    const oldUsername = user.name;

    const updatedQuestions = await questionModel.updateMany(
      { username: oldUsername },
      { $set: { username: newUsername } }
    );

    const updatedAnswers = await answerModel.updateMany(
      { username: oldUsername },
      { $set: { username: newUsername } }
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name: newUsername },
      { new: true }
    );

    return {
      user: updatedUser,
      updatedQuestions,
      updatedAnswers,
    };
  } catch (error) {
    throw new Error("Error updating username: " + error.message);
  }
};

const updateUserProfilePicture = async (id, imagePath) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      { imageLocation: imagePath },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error("Chyba pri aktualizácii užívateľa: " + error.message);
  }
};

const deleteUserProfilePicture = async (id) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      { imageLocation: "" },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error("Chyba pri aktualizácii užívateľa: " + error.message);
  }
};

const checkUserPassword = (passwordToCheck, userPassword, userSalt) => {
  if (!passwordToCheck || !userPassword || !userSalt) {
    throw new Error("Chýbajúce údaje na overenie hesla");
  }
  const hashedPassword = crypto
    .createHmac("sha256", userSalt)
    .update(passwordToCheck)
    .digest("hex");
  return hashedPassword === userPassword;
};

const updateUserKarma = async (Uid) => {
  try {
    if (!Uid) {
      throw new Erorr("Chýbajúci parameter User ID");
    }
    const updateUser = await userModel.findByIdAndUpdate(
      Uid,
      { $inc: { karma: 1 } },
      { new: true }
    );
  } catch (error) {
    console.error("Chyba pri aktualizácii požívateľa:", error.message);
    throw new Error("Chyba pri aktualizácii požívateľa");
  }
};

const updateUserSubplaces = async (userid, subplaceid) => {
  try {
    if (!userid || !subplaceid) {
      throw new Error("Chyba pri aktualizacií Subplaces");
    }
    const updateUser = await userModel.findByIdAndUpdate(userid, {
      $addToSet: { subplaces: subplaceid },
    });
  } catch (error) {
    throw new Error("Chyba pri aktualizacií Subplaces: " + error.message);
  }
};

const toggleQuestionUpvote = async (userid, questionid) => {
  try {
    const user = await userModel.findById(userid);

    const hasUpvoted = user.upvotedQuestions.includes(questionid);
    const hasDownvoted = user.downvotedQuestions.includes(questionid);

    let voteChange = 0;

    if (hasUpvoted) {
      await userModel.findByIdAndUpdate(userid, {
        $pull: { upvotedQuestions: questionid },
      });
      voteChange = -1;
    } else {
      await userModel.findByIdAndUpdate(userid, {
        $addToSet: { upvotedQuestions: questionid },
        $pull: { downvotedQuestions: questionid },
      });

      voteChange = hasDownvoted ? 2 : 1;
    }

    return voteChange;
  } catch (error) {
    throw new Error("Chyba pri prepínaní upvotu: " + error.message);
  }
};

const toggleQuestionDownvote = async (userid, questionid) => {
  try {
    const user = await userModel.findById(userid);

    const hasDownvoted = user.downvotedQuestions.includes(questionid);
    const hasUpvoted = user.upvotedQuestions.includes(questionid);

    let voteChange = 0;

    if (hasDownvoted) {
      await userModel.findByIdAndUpdate(userid, {
        $pull: { downvotedQuestions: questionid },
      });
      voteChange = 1;
    } else {
      await userModel.findByIdAndUpdate(userid, {
        $addToSet: { downvotedQuestions: questionid },
        $pull: { upvotedQuestions: questionid },
      });

      voteChange = hasUpvoted ? -2 : -1;
    }

    return voteChange;
  } catch (error) {
    throw new Error("Chyba pri prepínaní downvotu: " + error.message);
  }
};

const toggleAnswerUpvote = async (userid, answerid) => {
  try {
    const user = await userModel.findById(userid);

    const hasUpvoted = user.upvotedAnswers.includes(answerid);
    const hasDownvoted = user.downvotedAnswers.includes(answerid);

    let voteChange = 0;

    if (hasUpvoted) {
      await userModel.findByIdAndUpdate(userid, {
        $pull: { upvotedAnswers: answerid },
      });
      voteChange = -1;
    } else {
      await userModel.findByIdAndUpdate(userid, {
        $addToSet: { upvotedAnswers: answerid },
        $pull: { downvotedAnswers: answerid },
      });

      voteChange = hasDownvoted ? 2 : 1;
    }

    return voteChange;
  } catch (error) {
    throw new Error("Chyba pri prepínaní upvotu: " + error.message);
  }
};

const toggleAnswerDownvote = async (userid, answerid) => {
  try {
    const user = await userModel.findById(userid);

    const hasDownvoted = user.downvotedAnswers.includes(answerid);
    const hasUpvoted = user.upvotedAnswers.includes(answerid);

    let voteChange = 0;

    if (hasDownvoted) {
      await userModel.findByIdAndUpdate(userid, {
        $pull: { downvotedAnswers: answerid },
      });
      voteChange = 1;
    } else {
      await userModel.findByIdAndUpdate(userid, {
        $addToSet: { downvotedAnswers: answerid },
        $pull: { upvotedAnswers: answerid },
      });

      voteChange = hasUpvoted ? -2 : -1;
    }

    return voteChange;
  } catch (error) {
    throw new Error("Chyba pri prepínaní downvotu: " + error.message);
  }
};

const getUserVotes = async (userid) => {
  try {
    const user = await userModel
      .findById(userid)
      .select(
        "upvotedQuestions downvotedQuestions upvotedAnswers downvotedAnswers"
      )
      .lean();

    if (!user) throw new Error("Používateľ neexistuje");

    return {
      questionVotes: {
        upvoted: (user.upvotedQuestions || []).map((id) => id.toString()),
        downvoted: (user.downvotedQuestions || []).map((id) => id.toString()),
      },
      answerVotes: {
        upvoted: (user.upvotedAnswers || []).map((id) => id.toString()),
        downvoted: (user.downvotedAnswers || []).map((id) => id.toString()),
      },
    };
  } catch (error) {
    throw new Error("Chyba pri získavaní hlasov používateľa: " + error.message);
  }
};

const getJoinedSubplaces = async (userid) => {
  try {
    const user = await userModel.findById(userid).populate("subplaces", "name");
    const joinedNames = user.subplaces.map((sp) => sp.name);
    return joinedNames;
  } catch (error) {
    throw new Error("Chyba pri získavaní subplaces: " + error.message);
  }
};

const getJoinedSubplacesId = async (userid) => {
  try {
    const user = await userModel.findById(userid);

    return user.subplaces.map((sp) => sp.toString());
  } catch (error) {
    throw new Error("Chyba pri získavaní subplaces: " + error.message);
  }
};

const updateModerating = async (userId, subplaceId) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { moderator: subplaceId } },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error("Chyba pri updatovaní používateľa: " + error.message);
  }
};

const RemoveModerating = async (userId, subplaceId) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { moderator: subplaceId } },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error("Chyba pri updatovaní používateľa: " + error.message);
  }
};

module.exports = {
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  getAllUsers,
  getUserByEmail,
  checkUserPassword,
  updateUserKarma,
  updateUserSubplaces,
  toggleQuestionUpvote,
  toggleQuestionDownvote,
  getUserVotes,
  toggleAnswerDownvote,
  toggleAnswerUpvote,
  getJoinedSubplaces,
  getJoinedSubplacesId,
  updateUserProfilePicture,
  deleteUserProfilePicture,
  changeUsername,
  deleteUser,
  updateModerating,
  RemoveModerating,
};
