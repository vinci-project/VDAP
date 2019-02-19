# CDAP

Decentralized Directory Access Protocol

## Introduction

This is a the full stack [React](https://reactjs.org/) application with a [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/) backend. Client side code is written in React and the backend API is written using Express. This application is configured with [Airbnb's ESLint rules](https://github.com/airbnb/javascript) and formatted through [prettier](https://prettier.io/).

## To Run

```bash
# Clone the repository
git clone https://github.com/vinci/VDAP

# Go inside the directory
cd CDAP

# Install dependencies
yarn (or npm install)

# Start development server
yarn dev (or npm run dev)

# Build for production
yarn build (or npm run build)

# Start production server
yarn start (or npm start)

# Start Only Backend (Express + Stem + Storage Daemon + Blockchain Sim)
yarn backend (or npm run backend)

# Start A Daemon Storage Backend
yarn storagebe (or npm run storagebe)

# Start Blockchain Sim
yarn blockchain-sim (or npm run blockchain-sim)

# Start Test
yarn test (or npm test)
```

## Code Structure

`src/client`: The front end renders in the browser, a reactjs application.

`src/server`: An express.js based application that handles http request and turn them into ldap request.

`src/stem`: The LDAP query parser application runs on stem that does backend selection and blockchain operation.

`src/storage`: The Storage Backend Daemon runs as decentralized storage

`src/blockchain-sim`: A simulated blockchain that exposes api for report and backend nodes control

## Dev Mode And Related Ports

Running command `yarn dev` start five apps together.

Client Webpack serves at port `3000`.

The front server for webapp runs at port `8080`

The stem server runs at port `1389`

The storage BE runs as per daemon based, in dev mode we default create two local daemons running at port `9000` and `9001`

The Blockchain Sim runs a singleton express app at port `8545`

## Diagram

The diagram of read operations in CDAP

![Read Diagram](https://raw.githubusercontent.com/vinci/VDAP/master/read-diagram.png)

The diagram of create/update/delete operations in VDAP

![CUD Diagram](https://raw.githubusercontent.com/vinci/VDAP/master/modify-diagram.png)

## Development

We recommend to use the [VSCode](https://code.visualstudio.com/)

### VSCode + ESLint + Prettier

[VSCode](https://code.visualstudio.com/) is a lightweight but powerful source code editor. [ESLint](https://eslint.org/) takes care of the code-quality. [Prettier](https://prettier.io/) takes care of all the formatting.

#### Installation guide

1.  Install [VSCode](https://code.visualstudio.com/)
2.  Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
3.  Install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
4.  Modify the VSCode user settings to add below configuration

    ```javascript
    "eslint.alwaysShowStatus": true,
    "eslint.autoFixOnSave": true,
    "editor.formatOnSave": true,
    "prettier.eslintIntegration": true
    ```

Above, we have modified editor configurations. Alternatively, this can be configured at the project level by following [this article](https://medium.com/@netczuk/your-last-eslint-config-9e35bace2f99).
