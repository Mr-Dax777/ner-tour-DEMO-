const Review = require('../models/review');
const Location = require('../models/location')

// create a new review for a location
const addReview = async (req, res) => {
    try{
        

        const review = await Review.create({
            location: req.params.id,
            name: req.body.name,
            rating: req.body.rating,
            comment: req.body.comment,

        });

        const reviews = await Review.find({ location: req.params.id });
        const avgRating = reviews.length === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length; 
        const roundedRating = Math.round(avgRating * 10) / 10;

        console.log("Location ID:", req.params.id);
        console.log("Reviews found:", reviews.length);
        console.log("Average rating:", roundedRating);

         // update location
        await Location.findByIdAndUpdate(req.params.id, {
            rating: roundedRating,
            reviewCount: reviews.length
        });

        res.status(201).json({
            success: true,
            data: review
        })
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = { addReview };