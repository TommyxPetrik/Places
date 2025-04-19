const placeModel = require("../models/place.model");

const createPlace = async (placeData) => {
  try {
    const place = new placeModel(placeData);
    await place.save();
    return place;
  } catch (error) {
    throw new Error("Chyba pri vytváraní place: " + error.message);
  }
};

const getAllPlaces = async (req, res) => {
  try {
    const places = await placeModel
      .find()
      .populate("usersids", "name")
      .populate("subplaces", "name");
    return places;
  } catch (error) {
    throw new Error("Chyba pri získavaní všektých places: " + error.message);
  }
};

const getPlaceById = async (placeid) => {
  try {
    const place = await placeModel
      .findById(placeid)
      .populate("usersids", "name")
      .populate("subplaces", "name");
    if (!place) {
      throw new Error("Chyba pri získavaní place");
    }
    return place;
  } catch (error) {
    throw new Error("Chyba pri získavaní place: " + error.message);
  }
};

const getplaceByName = async (placename) => {
  try {
    const place = await placeModel
      .findOne({ name: placename })
      .populate("usersids", "name")
      .populate("subplaces", "name");
    if (!place) {
      return res.status(404).json({ message: "Place nebol nájdený" });
    }
    return place;
  } catch (error) {
    throw new Error("Chyba pri hľadaní place podľa mena" + error.message);
  }
};

const updateplace = async (placeid, placeData) => {
  try {
    const place = await placeModel
      .findByIdAndUpdate(placeid, placeData, { new: true })
      .populate("usersids", "name")
      .populate("subplaces", "name");
    if (!place) {
      throw new Error("Place neboj nájdený");
    }
    return place;
  } catch (error) {
    throw new Error("Chyba pri aktualizovaní place: " + error.message);
  }
};

const deleteplace = async (placeid) => {
  try {
    const place = await placeModel.findByIdAndDelete(placeid);
    if (!place) {
      throw new Error("Place nebol nájdený");
    }
    return place;
  } catch (error) {
    throw new Error("Chyba pri vymazavaní place: " + error.message);
  }
};

const updateUsers = async (userid) => {
  try {
    if (!userid) {
      throw new Error("Chyba pri pridávaní používateľa: " + error.message);
    }
    const place = await placeModel.findOneAndUpdate(
      {},
      { $addToSet: { usersids: userid } },
      { new: true }
    );
    await placeModel.findOneAndUpdate(
      {},
      { $set: { users: place.usersids.length } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Chyba pri pridávaní používateľa: " + error.message);
  }
};

const updateSubplaces = async (subplaceid) => {
  try {
    if (!subplaceid) {
      throw new Error("Chyba pri pridávaní subplace: " + error.message);
    }
    await placeModel.findOneAndUpdate(
      {},
      { $addToSet: { subplaces: subplaceid } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Chyba pri pridávaní subplace: " + error.message);
  }
};

const deleteSubplaces = async (subplaceid) => {
  try {
    if (!subplaceid) {
      throw new Error("Chyba pri vymazávaní subplace: " + error.message);
    }
    const place = await placeModel.findOneAndUpdate(
      {},
      { $pull: { subplaces: subplaceid } },
      { new: true }
    );
    await placeModel.findOneAndUpdate(
      {},
      { $set: { subplacesCount: place.subplaces.length } },
      { new: true }
    );
  } catch (error) {
    throw new Error("Chyba pri vymazávaní subplace: " + error.message);
  }
};

const getPlace = async () => {
  try {
    const place = await placeModel
      .find({})
      .populate("usersids", "name")
      .populate("subplaces", "name");
    if (!place) {
      throw new Error("Place nebol nájdený");
    }
    return place;
  } catch (error) {
    throw new Error("Chyba pri získavaní place: " + error.message);
  }
};

module.exports = {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updateplace,
  deleteplace,
  getplaceByName,
  updateUsers,
  updateSubplaces,
  getPlace,
  deleteSubplaces,
};
