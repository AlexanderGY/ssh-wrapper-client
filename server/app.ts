import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as MongoStore from 'connect-mongo';
import * as logger from 'morgan';
import * as session from 'express-session';
import * as mongoose from 'mongoose';
import * as config from './config';

const app: express.Express = express();

app.use(session({
  name: config.config.session.name,
  secret: config.config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 31536000000
  }
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const routeModules = require('require-all')({
  dirname: __dirname + '/routes',
  filter: (filename: string) => {
    filename = filename.toLowerCase();
    if ((filename.endsWith('.ts') && !filename.endsWith('.spec.ts'))
      || (filename.endsWith('.js') && !filename.endsWith('.spec.js'))) {
      return filename.substr(0, filename.length - 3);
    }
  },
  map: name => '/' + name
});

function resolve(root: string, modules): void {
  for (const name of Object.keys(modules)) {
    if (!name.startsWith('/')) {
      return;
    }
    const module = modules[name];
    if (module.default && module.default.route) {
      const router = module.default as express.Router;
      app.use(root, router);
    } else {
      resolve(root + name, module);
    }
  }
}
resolve('', routeModules);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


export default app;

mongoose.connect(config.config.db);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB connected');
});
