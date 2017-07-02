import * as mongoose from 'mongoose';

export interface IUser {
  user: string;
  password: string;
  isAdmin: boolean;
  team: string;
  isLeader: boolean;
};

const userSchema = new mongoose.Schema({
  user: String,
  password: String,
  isAdmin: Boolean,
  team: String,
  isLeader: Boolean
});

interface IUserModel extends IUser, mongoose.Document {}

const User = mongoose.model<IUserModel>('User', userSchema);

export default User;
