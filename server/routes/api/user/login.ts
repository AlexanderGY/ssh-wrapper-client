import {Router, Request, Response} from 'express';
import * as expressSession from 'express-session';

const user = require('../../../models/user').default;
const team = require('../../../models/team').default;

export default Router()
  .post('/login', userLogin)
  .get('/settings', userSettings)
  .put('/team', teamUpdate)
  .delete('/session', removeSession);

  export function errorHandler(err, res) {
    console.log('DB connection or permission error. Traceback:\n' + err);
    res.status(500).send({error: err});
  }

export function teamUpdate(req: any, res: Response) {
  team.find({name: req.body.name}, (err, t) => {
    if (err) {
      errorHandler(err, res);
    }
    if (t.length) {
      Object.assign(t[0], req.body);
      t[0].save(err => {
        if (err) {
          errorHandler(err, res);
        }
        for (let i = 0; i < req.body.users.length; i++) {
            user.find({user: req.body.users[i]}, (err, r) => {
              if (err) {
                errorHandler(err, res);
              }
              r[0].team = req.session.user.team;
              r[0].save();
            })
        }
        req.session.user.list = req.body;
        res.send({message: 'Updated', data: req.session.user});
      });
    } else {
      const te = new team();
      Object.assign(te, req.body);
      te.save(err => {
        if (err) {
          errorHandler(err, res);
        }
        res.send({message: 'Created'});
      })
    }
  })
}

export function removeSession(req:any, res:Response) {
  req.session.user = {};
  req.session.destroy(err => {
    if (err) {
      errorHandler(err, res);
    }
    res.send({message: 'Session destroyed'});
  })
}

export function userSettings(req:any, res: Response) {
  if (req.session) {
    res.send({data: req.session});
  } else {
    errorHandler({error: 'Session undefined'}, res);
  }
}

export function userLogin(req: Request, res: Response) {
  user.find({user: req.body.val.user}, (err, data) => {
    if (!err) {
      if (data.length) {
        if (req.body.val.password === data[0].password) {
          let xhrResponseData = {
            signed: true,
            user: data[0].user,
            isAdmin: data[0].isAdmin,
            isLeader: data[0].isLeader,
            team: data[0].team
          }
          team.find({name: data[0].team}, (err, list) => {
            if (!err) {
              if (list.length) {
                Object.assign(xhrResponseData, {list: list[0]});
              }
              setSession(req, xhrResponseData);
              res.send(xhrResponseData);
            }
          })
        } else {
          res.send({
            error: true,
            description: {
              password: 'Password incorrect'
            }
          })
        }
      } else {
        const newUser = new user();
        Object.assign(newUser, {
          user: req.body.val.user,
          password: req.body.val.password,
          isAdmin: false,
          isLeader: false,
          team: ''
        })
        newUser.save((err) => {
          if (!err) {
            let xhrResponseData = {
              signed: true,
              user: req.body.val.user,
              isAdmin: false,
              isLeader: false,
              team: ''
            }
            setSession(req, xhrResponseData);
            res.send(xhrResponseData);
          }
        })
      }
    }
  });
};

export function setSession(req, data) {
  req.session.user = data;
}
