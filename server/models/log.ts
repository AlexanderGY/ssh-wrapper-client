import * as mongoose from 'mongoose';

export interface ILog {
  ip: string;
  user: string;
  command: string;
  date: string;
};

const logSchema = new mongoose.Schema({
  ip: String,
  user: String,
  command: String,
  date: String
});

interface ILogModel extends ILog, mongoose.Document {}

const Log = mongoose.model<ILogModel>('Log', logSchema);

export default Log;
