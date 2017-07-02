import * as mongoose from 'mongoose';

export interface ITeam {
  name: string;
  users: Array<string>
};

const teamSchema = new mongoose.Schema({
  name: String,
  users: Array
});

interface ITeamModel extends ITeam, mongoose.Document {}

const Team = mongoose.model<ITeamModel>('Team', teamSchema);

export default Team;
