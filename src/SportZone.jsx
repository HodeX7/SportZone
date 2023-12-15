import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const SportZone = ({ contract, account }) => {
  const [tournament, setTournament] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: "",
    description: "",
    imageURL: "",
    price: 0,
  });

  useEffect(() => {
    getTournamentsFromBlockchain();
  }, [contract]);

  const addTournament = async () => {
    try {
      const priceWei = ethers.parseEther(newTournament.price);
      const txn = await contract.addTournament(
        newTournament.name,
        newTournament.description,
        newTournament.imageURL,
        priceWei
      );
      await txn.wait();
      getTournamentsFromBlockchain();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating a Tournament:", error);
    }
  };

  const getTournamentsFromBlockchain = async () => {
    try {
      const tournamentsArray = await contract.getTournaments();
      // console.log("Raw Tournaments Array:", tournamentsArray);

      const tournaments = tournamentsArray.map((tournament) => ({
        name: tournament.name,
        description: tournament.description,
        imageURL: tournament.imageURL,
        price: ethers.formatUnits(tournament.entryFee, "ether"),
        viewers: tournament.participants.length,
      }));

      console.log("Formatted Tournaments:", tournaments);
      setTournament(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const handleBuy = async (tournamentId) => {
    try {
      const priceWei = ethers.parseEther(tournament[tournamentId].price);
      await contract.participateInTournament(tournamentId, { value: priceWei });
      getTournamentsFromBlockchain();
    } catch (error) {
      alert("Error buying the tournament ticket: Insufficient balance");
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-blue-600 min-h-screen">
      <div className="fixed w-full top-0 bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <h6 className="text-lg font-bold">
            <span>Book your tickets now with</span>
            <span className="text-yellow-400 font-mono text-2xl ml-2">
              SportZone
            </span>
          </h6>
        </div>
        {account === "0x49fedd3f224aa487400c41b0d3d6e0a6f1029848" && (
          <button
            className="bg-yellow-500 text-gray-900 px-3 py-1.5 rounded-md hover:bg-yellow-600 transition duration-300 transform scale-95"
            onClick={() => setIsModalOpen(true)}
          >
            Add Tournament
          </button>
        )}
      </div>

      <div className="mt-96 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
        {tournament.length > 0 ? (
          tournament.map((tour, index) => (
            <div
              key={index}
              className="border p-4 rounded-md shadow-lg hover:shadow-2xl transition duration-300"
            >
              <img
                src={tour.imageURL}
                className="h-48 w-full object-cover mb-4 rounded-md"
                alt="tournament_image"
              />
              <h2 className="text-2xl text-yellow-400 font-bold mb-2">
                {tour.name}
              </h2>
              <p className="text-white mb-4">{tour.description}</p>
              <p className="text-gray-300">Tickets Price: {tour.price} ETH</p>
              <p className="text-gray-300">Tickets Sold: {tour.viewers}</p>
              <button
                onClick={() => handleBuy(index)}
                className="mt-4 bg-yellow-500 text-gray-900 px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
              >
                Buy Tickets
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-300 text-center mt-8">
            No tournaments available.
          </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Tournament Modal"
      >
        <h2 className="text-xl font-semibold mb-4">Add Tournament</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTournament();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              value={newTournament.name}
              onChange={(e) =>
                setNewTournament({ ...newTournament, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              className="w-full border p-2 rounded-md"
              value={newTournament.description}
              onChange={(e) =>
                setNewTournament({
                  ...newTournament,
                  description: e.target.value,
                })
              }
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image URL:
            </label>
            <textarea
              className="w-full border p-2 rounded-md"
              value={newTournament.imageURL}
              onChange={(e) =>
                setNewTournament({ ...newTournament, imageURL: e.target.value })
              }
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price (ETH):
            </label>
            <input
              type="number"
              step="any"
              className="w-full border p-2 rounded-md"
              value={newTournament.price}
              onChange={(e) =>
                setNewTournament({ ...newTournament, price: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Create Tournament
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default SportZone;
