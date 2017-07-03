import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

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
  isLeader: Boolean,
});

interface IUserModel extends IUser, mongoose.Document {}

const _User = mongoose.model<IUserModel>('User', userSchema);

class User extends _User {

  salt: string = String(Math.round(Math.random() * new Date().valueOf()));

  encryptPassword() {
    return crypto.createHmac('sha1', this.salt).update(this.password).digest('hex');
  }

}

export default User;
