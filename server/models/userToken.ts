import mongoose from 'mongoose';
export interface UserTokenDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  refreshToken: String;
}
const userTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);
const UserToken = mongoose.model<UserTokenDoc>('userToken', userTokenSchema);
export default UserToken;
