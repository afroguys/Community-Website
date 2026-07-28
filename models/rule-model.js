const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Rule', ruleSchema, 'rules');
