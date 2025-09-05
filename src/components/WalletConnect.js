import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletConnect = () => {
  const [hasProvider, setHasProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const detectProvider = async () => {
      const { ethereum } = window;
      setHasProvider(Boolean(ethereum));
      if (ethereum) {
        ethereum.on && ethereum.on("accountsChanged", handleAccountsChanged);
        ethereum.on && ethereum.on("chainChanged", handleChainChanged);

        try {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length) setAccount(accounts[0]);
          const chain = await ethereum.request({ method: "eth_chainId" });
          setChainId(chain);
        } catch (err) {
          console.error("init error", err);
        }
      }
    };

    detectProvider();

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setStatus("disconnected");
    } else {
      setAccount(accounts[0]);
      setStatus("connected");
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask extension.");
      return;
    }
    try {
      setStatus("connecting");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      handleAccountsChanged(accounts);
      setStatus("connected");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const disconnect = () => {
    setAccount(null);
    setStatus("disconnected");
  };

  const signMessage = async () => {
    if (!account) {
      alert("Connect wallet first");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const message = "Sign this message to authenticate: " + new Date().toISOString();
      const signature = await signer.signMessage(message);
      alert("Signature:\n" + signature);
      console.log({ account, message, signature });
    } catch (err) {
      console.error("sign error", err);
      alert("Failed to sign message: " + (err.message || err));
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, maxWidth: 720 }}>
      <p><strong>MetaMask detected:</strong> {hasProvider === null ? "checking..." : hasProvider ? "Yes" : "No"}</p>
      <p><strong>Connection status:</strong> {status}</p>
      <p><strong>Network chainId:</strong> {chainId || "-"}</p>
      <p><strong>Account:</strong> {account || "Not connected"}</p>

      {!account ? (
        <button onClick={connectWallet} style={{ padding: "8px 12px", marginRight: 8 }}>Connect MetaMask</button>
      ) : (
        <button onClick={disconnect} style={{ padding: "8px 12px", marginRight: 8 }}>Disconnect (UI)</button>
      )}

      <button onClick={signMessage} style={{ padding: "8px 12px" }}>Sign Message</button>

      <div style={{ marginTop: 12, color: "#666" }}>
        <p><small>Note: signing a message is commonly used for passwordless authentication — backend verifies signature.</small></p>
      </div>
    </div>
  );
};

export default WalletConnect;
