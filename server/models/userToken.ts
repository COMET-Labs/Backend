import mongoose from 'mongoose';
const userTokenSchema = new mongoose.Schema(
  {
    user: {
      // type: mongoose.Schema.Types.ObjectId,
      type: Number,
      ref: 'users'
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);
const UserToken = mongoose.model('userToken', userTokenSchema);
export default UserToken;
