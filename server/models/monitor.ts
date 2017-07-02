import * as mongoose from 'mongoose';

export interface IMonitor {
  name: string;
  team: string;
  targets: string;
  domain: string;
  results: Array<any>
};

const monitorSchema = new mongoose.Schema({
  name: String,
  team: String,
  targets: String,
  domain: String,
  results: Array
});

interface IMonitorModel extends IMonitor, mongoose.Document {}

const Monitor = mongoose.model<IMonitorModel>('Monitor', monitorSchema);

export default Monitor;
