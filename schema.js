// const joi = require("joi");

// module.exports.reviewSchema = joi.object({
//     review: joi.object({
//         rating:joi.number().required(),
//         Comment:joi.string().required(),
//     }).required(),
// });
const Joi = require("joi");

const reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required(),
        text: Joi.string().required(),
        // Comment:joi.string().required(),
        // author: Joi.string().required()
    }).required()
});

module.exports = { reviewSchema };
