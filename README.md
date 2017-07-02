Web ssh client

git clone
cd yigis
npm install
npm run dev

Before you get started, add config.ts file in your /server folder

```
export const config = {
  session: {
    name: 'yigisSessionTestConfiguration',
    secret: Math.floor(Math.random() * 100000) + '_yigisSeed'
  },
  ssh: {
    host: ' ',
    user: ' ',
    pass: ' ',
    port: ' '
  },
  git: {
    username: ' ',
    password: ' '
  },
  repository: ' ',
  db: ' '
}
```

# TODO WRITE DESCRIPTION
