const { Schema, model } = require('mongoose');


const schema = new Schema({
    title: { type: String, required: [true,'Title is required'] },
    description: { type: String, maxLength: [50, 'Description can\'t be more than 50 characters'], required: [true,'Description is required'] },
    imageUrl: { type: String, required: [true,'ImageUrl is required'] },
    public: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now },
    userLiked: [{ type: Schema.Types.ObjectId, ref: 'User', default: []}],
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = model('Play',schema);