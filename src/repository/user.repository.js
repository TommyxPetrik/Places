const userModel = require("../models/user.model");
const crypto = require("crypto");

const getAllUsers = async() => {
    try {
        const users = await userModel.find().populate("subplaces", "name");
        return users;
    } catch (error) {
        throw new Error('Chyba pri získavaní všetkých užívateľov: ' + error.message);
    }
};

const getUserById = async (id) => {
    try {
        const user = await userModel.findById(id);
        return user;
    } catch (error) {
        throw new Error('Chyba pri získavaní užívateľa: ' + error.message);
    }
};

const getUserByUsername = async (name) => {
    try {
        const user = await userModel.findOne({ name: name });
        return user;
    } catch (error) {
        throw new Error('Chyba pri získavaní užívateľa podľa username: ' + error.message);
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
        throw new Error("Chyba pri získavaní užívateľa podľa emailu " + error.message);
    }
}

const createUser = async (userData) => {
    try {
        const user = new userModel(userData);
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Chyba pri vytváraní užívateľa: ' + error.message);
    }
};

const updateUser = async (id, userData) => {
    try {
        const user = await userModel.findByIdAndUpdate(id, userData, { new: true });
        return user;
    } catch (error) {
        throw new Error('Chyba pri aktualizácii užívateľa: ' + error.message);
    }
};

const checkUserPassword = (passwordToCheck, userPassword, userSalt) => {
    if (!passwordToCheck || !userPassword || !userSalt) {
        throw new Error("Chýbajúce údaje na overenie hesla");
    }
    const hashedPassword = crypto.createHmac("sha256", userSalt).update(passwordToCheck).digest("hex");
    return hashedPassword === userPassword;
};

const updateUserKarma = async (Uid) => {
    try {
        if (!Uid) {
            throw new Erorr("Chýbajúci parameter User ID")
        }
        const updateUser = await userModel.findByIdAndUpdate(Uid,{$inc: { karma: 1} }, { new: true });
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
        const updateUser = await userModel.findByIdAndUpdate(userid, {$addToSet: { subplaces: subplaceid}});
        
    } catch (error) {
        throw new Error("Chyba pri aktualizacií Subplaces: " + error.message )
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
}