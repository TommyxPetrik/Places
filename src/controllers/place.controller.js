const placeRepository = require("./../repository/place.repository");
const userRepository = require("./../repository/user.repository");

const createplace = async (req, res) => {
    try {
        if (!req.user || !req.user.userid) {
            return res.status(401).json({ message: "Neautorizovaný prístup" });
        }
        const place = await placeRepository.createPlace(req.body);
        res.status(201).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};

const getAllPlaces = async (req, res) => {
    try {
        const places = await placeRepository.getPlace();
        if (!places || places == [] || places.length === 0) {
            res.status(200).json(" Neboli nájdené žiadne places ");
        };
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getplaceById = async (req, res) => {
    try {
        const place = await placeRepository.getPlaceById(req.params.id);
        if (!place) {
            return res.status(404).json({ message: "place not found" });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getByNameController = async (req, res) => {
    try {
        if (!req.query.name) {
            return res.status(400).json("Meno nieje spávne zadané ")
        }
        
        
        const place = await placeRepository.getplaceByName(req.query.name);
        if (!place) {
            return res.status(404).json({ message: "place not found" });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePlace = async (req, res) => {
    try {
        const place = await placeRepository.updateplace(req.query.id, req.body);
        if (!place) {
            return res.status(404).json({ message: "place not found" });
        }
        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteplace = async (req, res) => {
    try {
        const place = await placeRepository.deleteplace(req.params.id);
        if (!place) {
            return res.status(404).json({ message: "place not found" });
        }
        res.status(200).json({ message: "place deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createplace,
    getAllPlaces,
    getplaceById,
    updatePlace,
    deleteplace,
    getByNameController,
    
};
