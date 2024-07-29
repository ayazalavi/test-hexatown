import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String, // String is shorthand for {type: String}
  dateSignedUp: { type: Date, default: Date.now },
  dateLastSigned: { type: Date, default: Date.now },
});

// Or, assign a function to the "methods" object of our animalSchema
userSchema.methods.updateLastSignedIn = function () {
  return mongoose
    .model("User")
    .updateOne({ username: this.username }, { dateLastSigned: new Date() });
};

export const User = mongoose.model("User", userSchema);
