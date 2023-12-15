import React, { useEffect, useState } from "react";
import RetailMart from "./RetailMart";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

const Login = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    const Address = "0x86441C90373DE17547cF34d17741dCDEfe0Ba3D1";
    const ABI = [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ProductAdded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
        ],
        name: "ProductPurchased",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
          {
            internalType: "string",
            name: "_imageURL",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_price",
            type: "uint256",
          },
        ],
        name: "addProduct",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getProducts",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "imageURL",
                type: "string",
              },
              {
                internalType: "address[]",
                name: "buyers",
                type: "address[]",
              },
            ],
            internalType: "struct RetailMart.Product[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getProductsByBuyer",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "imageURL",
                type: "string",
              },
              {
                internalType: "address[]",
                name: "buyers",
                type: "address[]",
              },
            ],
            internalType: "struct RetailMart.Product[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "products",
        outputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "imageURL",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "productsByBuyer",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "productId",
            type: "uint256",
          },
        ],
        name: "purchaseProduct",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ];
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      setAccount(accounts[0]);

      let contract;
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      contract = new ethers.Contract(Address, ABI, signer);
      setContract(contract);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black bg-cover">
      {account ? (
        <RetailMart contract={contract} account={account} />
      ) : (
        <>
          <button
            onClick={connectWallet}
            className="bg-white text-black px-10 py-8 rounded-md hover:bg-blue-950 hover:text-white transition duration-300"
            style={{ opacity: 0.7 }}
          >
            Connect with MetaMask
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
