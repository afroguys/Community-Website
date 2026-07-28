const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, enum: ['gallery', 'aktiviti'], default: 'gallery' },
    createdBy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema, 'galleries');
