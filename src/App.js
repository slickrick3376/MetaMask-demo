import React from "react";
import WalletConnect from "./components/WalletConnect";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 24 }}>
      <h1>MetaMask React Demo</h1>
      <p>Simple demo: connect MetaMask, show address, sign a message.</p>
      <WalletConnect />
    </div>
  );
}

export default App;
