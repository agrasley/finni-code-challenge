# Finni Code Challenge

## Running Locally

If you don't have `nvm` installed, follow the instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating) to install it.
With `nvm` installed, run `nvm use` in the project directory. If necessary, install the version of node as prompted by nvm.

### Running the Backend

In the `server` directory run the following commands:

```
$ npm install
$ npm run initDB
$ npm start
```

### Running the Frontend

In the main project directory run the following commands:

```
$ npm install
$ npm start
```

Your browser should automatically open to localhost:3000. Enjoy!

## Logging In

There are three demo users available. `provider1` and `provider2` come
prepopulated with patients, while `provider3` has no data. `provider1`
also comes with some sample custom fields prepopulated. Log in with any
of those 3 usernames and the password `finnihealth`.
