import mongoose from "mongoose";

/**
 * No login, no signup, no Clerk. This is just an anonymous session record
 * so "my documents" / favourite / rename / history have something to key
 * off of. A random token is generated on first visit and stored in an
 * httpOnly cookie — invisible to the user, nothing for them to fill in.
 */
const UserSchema = new mongoose.Schema(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    documentCount: {
      type: Number,
      default: 0,
    },
    preferences: {
      mode: {
        type: String,
        enum: ["beginner", "business", "law_student", "eli15"],
        default: "beginner",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
