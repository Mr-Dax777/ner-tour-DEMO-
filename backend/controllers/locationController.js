const Location = require('../models/location');

// Add location
const createLocation = async (req, res) => {

    console.log(req.body);
    req.longitude = 95.278207;
    req.latitude = 27.623393;
    try {
        const location = await Location.create(req.body);
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all locations
const getLocations = async (req, res) => {
    console.log("eh");

    try {
        const { state, category, page=1, limit=100} = req.query;

        let filter = {};

        if (state) {
            filter.state = new RegExp(state, 'i');  // case insensitive search
        }

        if (category) {
            filter.category = new RegExp(category, 'i'); // case insensitive category search
        }

        const skip = (page - 1) * limit;

        const locations = await Location.find(filter).skip(skip).limit(Number(limit));
        const total = await Location.countDocuments(filter)
        res.json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: locations
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get single location by id
const getLocationById = async (req, res) => {

    try{
        const location = await Location.findById(req.params.id);

        if(!location){
            return res.status(404).json({ 
                success: false,
                message: 'Location not found'
            });
        }
        res.json({
            success: true,
            data: location
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Invalid ID format"
        })
    }
        
    
}

//update location
const updateLocation = async (req, res) => {

    try{
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if(!location){
            res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }
        res.json({
            success: true,
            data: location
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "error.message"
        })
    }
}

//delete location
const deleteLocation = async (req, res) => {

    try{
        const location = await Location.findByIdAndDelete(req.params.id);

        if(!location){
            res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }
        res.json({
            success: true,
            message: 'Location deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Invalid ID"
        })
    }
}

// image upload controller
const uploadImage = async (req, res) => {

    try{
        const location = await Location.findById(req.params.id);

        if(!location){
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        location.images.push(req.file.filename);
        await location.save();

        res.json({
            success: true,
            data: location
        })
    }catch(error){  
        res.status(500).json({ message: error.message });
    }
}



// get hidden gems
const getHiddenGems = async (req, res) => {

    try{
        const locations = await Location.find({
            rating: { $gte: 4 },
            reviewCount: { $lt: 20 }
        });
        res.json({
            success: true,
            count: locations.length,
            data: locations
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createLocation,
    getLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
    uploadImage,
    getHiddenGems
};

