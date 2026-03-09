const express = require('express');
const router = express.Router();
const {
    createLocation,
    getLocations,
    getLocationById,
    updateLocation,
    deleteLocation,
    uploadImage,
    getHiddenGems
} = require('../controllers/locationController');
const upload = require('../config/multer');

router.get('/hidden-gems', getHiddenGems);

router.post('/', createLocation);
router.get('/', getLocations);

router.get('/:id', getLocationById);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);


router.post('/:id/images', upload.single('image'), uploadImage);


module.exports = router;