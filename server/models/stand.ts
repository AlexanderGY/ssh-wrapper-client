import * as mongoose from 'mongoose';

export interface IStand {
  name: string;
  team: string;
  src: string;
  url: string;
  commands: Array<any>
};

const standSchema = new mongoose.Schema({
  name: String,
  team: String,
  src: String,
  url: String,
  commands: Array
});

interface IStandModel extends IStand, mongoose.Document {}

const Stand = mongoose.model<IStandModel>('Stand', standSchema);

export default Stand;
