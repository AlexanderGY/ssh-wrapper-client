import {Router, Request, Response} from 'express';
import * as expressSession from 'express-session';
import * as SSH from 'simple-ssh';
import * as cheerio from 'cheerio';
import * as needle from 'needle';
import * as github from 'octonode';
import * as config from '../../../config';

const stand = require('../../../models/stand').default;
const monitor = require('../../../models/monitor').default;
const log = require('../../../models/log').default;

export default Router()
  .post('/ssh', handleStand)
  .post('/stand', createStand)
  .post('/active-branch', getActiveBranch)
  .put('/change-branch', changeBranch)
  .get('/stands', getStands);

export function errorHandler(err, res) {
  console.log('DB connection or permission error. Traceback:\n' + err);
  res.status(500).send({error: err});
}

export function createStand(req: any, res: Response) {
  let data = req.body.block;
  const newStand = new stand();
  data.team = req.session.user.team;
  Object.assign(newStand, data);
  stand.find({name: data.name}, (err, d) => {
    if (err) {
      errorHandler(err, res);
    }
    if (d[0]) {
      Object.assign(d[0], data);
      d[0].save(err => {
        if (err) {
          errorHandler(err, res);
        }
        stand.find({team: req.session.user.team}, (err, allStands) => {
          if (err) {
            errorHandler(err, res);
          }
          res.send({data: allStands});
        })
      })
    } else {
      newStand.save((err) => {
        if (err) {
          errorHandler(err, res);
        }
        stand.find({team: req.session.user.team}, (err, allStands) => {
          if (err) {
            errorHandler(err, res);
          }
          res.send({data: allStands});
        })
      })
    }
  })
}

export function getActiveBranch(req: any, res: Response) {
  if (req.session.user.team) {
    let ssh = new SSH(config.config.ssh);
    let command = req.body.src + ' && git branch | grep \\* | cut -d \' \' -f2';
    if (!req.body.src) {
      res.send({error: 'Comamnd not found'});
      return;
    }
    let active;
    ssh.exec(command, {
        out: (stdout) => {
          active = stdout;
        },
        err: (err) => {
          if (err) {
            errorHandler(err, res);
          }
        },
        exit: (code) => {
          res.status(200).send({active: active});
        }
    })
    .start();
  } else {
    res.send({error: 'Access denied'});
  }
}

export function changeBranch(req: any, res: Response) {
  if (req.session.user.team) {
    let ssh = new SSH(config.config.ssh);
    let command = req.body.stand + ' && git pull && git checkout ' + req.body.branch;
    if (!req.body.stand || !req.body.branch) {
      res.send({error: 'Comamnd not found'});
      return;
    }
    ssh.exec(command, {
        err: (err) => {
          if (err) {
            errorHandler(err, res);
          }
        },
        exit: (code) => {
          res.status(200).send();
        }
    })
    .start();
  } else {
    res.send({error: 'Access denied'});
  }
}

export function getStands(req: any, res: Response) {
  if (req.session.user.user) {
    stand.find({team: req.session.user.team}, (err, data) => {
      if (data) {
        let client = github.client(config.config.git);
        let ssh = new SSH(config.config.ssh);
        let command = data[0].src + ' && git branch | grep \\* | cut -d \' \' -f2';
        let active;

        ssh.exec(command, {
            out: (stdout) => {
              active = stdout;
            },
            err: (err) => {
              if (err) {
                errorHandler(err, res);
              }
            },
            exit: (code) => {
              let targr = client.repo(config.config.repository);

              targr.branches({per_page: 1000}, (err, dt) => {
                if (err) {
                  errorHandler(err, res);
                }
                if (!err && req.session.user.team) {
                  res.send({data: data, repos: dt, active: active});
                } else {
                  res.send({data: data});
                }
              });
            }
        })
        .start();
      }
    });
  } else {
    res.send({error: 'Access denied'});
  }
}

export function handleStand(req: any, res: Response) {
  if (req.session.user.team) {
    let ssh = new SSH(config.config.ssh);
    let command = req.body.command;
    if (!command) {
      res.send({error: 'Comamnd not found'});
      return;
    }
    const toLog = {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      command: command,
      user: req.session.user.user,
      date: new Date()
    }

    log(toLog).save();

    ssh.exec(command, {
        err: (err) => {
          if (err) {
            errorHandler(err, res);
          }
        },
        exit: (code) => {
          res.send({text: 'Complete'});
        }
    })
    .start();
  } else {
    res.send({error: 'Access denied'});
  }
}
