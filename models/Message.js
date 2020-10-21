const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  message: String,
  subject: String,
  creationDate: {
    type: Date,
    require: true
  },
  read: {
    type: Boolean,
    require: true
  }
});

messageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Message", messageSchema);
