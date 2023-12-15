import React, { useEffect, useState } from "react";
import SportZone from "./SportZone";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

const Login = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    const Address = "0x81a797307ec16a23b8b4d2B7D012DBE5A6623626";
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
            name: "tournamentId",
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
            name: "entryFee",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "TournamentAdded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "tournamentId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "participant",
            type: "address",
          },
        ],
        name: "TournamentParticipated",
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
            name: "_entryFee",
            type: "uint256",
          },
        ],
        name: "addTournament",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getTournaments",
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
                name: "entryFee",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "imageURL",
                type: "string",
              },
              {
                internalType: "address[]",
                name: "participants",
                type: "address[]",
              },
            ],
            internalType: "struct SportZone.Tournament[]",
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
            name: "tournamentId",
            type: "uint256",
          },
        ],
        name: "participateInTournament",
        outputs: [],
        stateMutability: "payable",
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
        name: "tournaments",
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
            name: "entryFee",
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
        name: "tournamentsByParticipant",
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
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 to-blue-600 ">
      {account ? (
        <SportZone contract={contract} account={account} />
      ) : (
        <>
          <button
            onClick={connectWallet}
            className="bg-white text-black px-10 py-8 rounded-md hover:bg-gradient-to-r from-purple-300 to-blue-200 hover:text-black transition duration-300"
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
