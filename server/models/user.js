const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

/**
 * Esquema de demonstração e um modelo de usuário onde tem um campo para salvar sua senha codificada e o salt
 */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      passwordHash: String,
      salt: String
    }
  }
);

module.exports = mongoose.model("User", UserSchema);
