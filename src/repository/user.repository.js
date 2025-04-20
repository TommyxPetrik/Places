const userModel = require("../models/user.model");
const crypto = require("crypto");

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
    const user = await userModel.findById(id);
    return user;
  } catch (error) {
    throw new Error("Chyba pri získavaní užívateľa: " + error.message);
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
        upvoted: user.upvotedQuestions.map((id) => id.toString()),
        downvoted: user.downvotedQuestions.map((id) => id.toString()),
      },
      // answerVotes: {
      //   upvoted: user.upvotedAnswers.map((id) => id.toString()),
      //   downvoted: user.downvotedAnswers.map((id) => id.toString()),
      // },
    };
  } catch (err) {
    throw new Error("Chyba pri získavaní hlasov používateľa: " + err.message);
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
};
