# MetaMask React Demo

Simple demo app showing how to:
- Detect MetaMask (window.ethereum)
- Connect to MetaMask (eth_requestAccounts)
- Show connected account and chainId
- Sign a message using ethers.js (signMessage)

## Run locally
1. `npm install` or `yarn`
2. `npm start` or `yarn start`
3. Open http://localhost:3000 and use a browser with MetaMask installed

## Notes
- Signing a message is commonly used for passwordless authentication — backend verifies signature using ethers.utils.verifyMessage.
- This project uses react-scripts (Create React App) for simplicity. You can adapt to Vite if preferred.
