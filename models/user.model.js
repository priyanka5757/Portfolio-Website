import mongoose, { Schema } from 'mongoose';

// Define the schema for storing user details
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
},
   {timestamps: true}
);

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

export default User;
