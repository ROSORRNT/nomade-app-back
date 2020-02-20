const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: { type: String, required: true },
})

// made sure that we can query our email as fast as possible in our DTB with the unique prop
UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', UserSchema)
