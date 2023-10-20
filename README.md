# Fuel Sample dApp: Microblog

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Respectful-orange)](CODE_OF_CONDUCT.md)
[![Made with Love](https://img.shields.io/badge/Made%20with-Love-ff69b4.svg)](https://shields.io/)

This is a sample dApp that demonstrates how to use Fuel to build a simple personal microblog. It is a simple web application that allows users to post short messages to a public feed. The messages are stored in a Fuel contract on-chain and can be read by anyone. The application is built on the frontend using [React](https://reactjs.org/) and the [Fuel TypeScript SDK](https://www.npmjs.com/package/fuels), and on the backend using [Sway](https://docs.fuel.network/docs/sway/), the Rust DSL for smart contract development. The contract is deployed to [Fuel](https://www.fuel.network/).

## Getting Started

### Installation

#### Frontend

To install the frontend, run the following commands:

```bash
cd frontend
npm install
```

#### Backend

To build the backend, run the following commands:

```bash
cd blog-contract
forc build
```

You must have the forc build tools installed prior to running `forc build`. To install the forc build tools, follow this [step by step guide](https://docs.fuel.network/guides/installation/). 

You can install the entire forc toolchain with one command:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://install.fuel.network/fuelup-init.sh | sh
```

Once installed, make sure you are set to the correct Fuel testnet, as of the time of this writing that is `beta-4``, but you should always check [the docs]() to ensure you are using the latest testnet. To set the testnet, run the following command:

```bash
fuelup toolchain install beta-4
fuelup default beta-4
```

Once the smart contract is built using `forc build`, you can deploy it to the Forc testnet using the following command:

```bash
forc deploy --testnet
```

### Running the Application

Once you have finished building your contract and deploying it, you are ready to run your frontend and interact with your contract. 

The output from the `forc deploy --testnet` command provided you with your smart contract ID, copy that ID and return back to the `./frontend` folder, rename the `.env.sample` file to `.env` and update the environment variable value called `REACT_APP_CONTRACT_ID` with your smart contract ID.

Then, start your React app by running `npm start` from the `./frontend` folder. This will start your React app on port `3000` by default.

You can access it in your browser at `http://localhost:3000`.

## Code of Conduct

Please read the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on the code of conduct for this project.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.