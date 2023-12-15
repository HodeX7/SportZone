import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const RetailMart = ({ contract, account }) => {
  const [product, setProduct] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    imageURL: "",
    price: 0,
  });

  useEffect(() => {
    getProductsFromBlockchain();
  }, [contract]);

  const addProduct = async () => {
    try {
      const priceWei = ethers.parseEther(newProduct.price);
      const txn = await contract.addProduct(
        newProduct.name,
        newProduct.description,
        newProduct.imageURL,
        priceWei
      );
      await txn.wait();
      getProductsFromBlockchain();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating a Product:", error);
    }
  };

  const getProductsFromBlockchain = async () => {
    try {
      const productsArray = await contract.getProducts();
      const products = productsArray.map((product) => ({
        title: product.title,
        description: product.description,
        imageURL: product.imageURL,
        price: ethers.formatUnits(product.price, "ether"),
      }));
      setProduct(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleBuy = async (productId) => {
    try {
      const priceWei = ethers.parseEther(product[productId].price);
      await contract.purchaseProduct(productId, { value: priceWei });
      getProductsFromBlockchain();
    } catch (error) {
      console.error("Error buying the product:", error);
    }
  };

  return (
    <div className="bg-cover min-h-full">
      <div className="fixed top-0 w-full bg-gray-800 p-4 text-white flex justify-between items-center">
        <h6 className="text-md font-semibold">
          <span>All in one Retail Store</span>
          <span className="text-blue-500 font-montserrat text-xl">
            {" "}
            RetailMart
          </span>
        </h6>
        {account === "0xdcc83b7f99ab531c0c1b7b9aff34fd953f9bdc83" && (
          <button
            className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition duration-300 transform scale-95"
            onClick={() => setIsModalOpen(true)}
          >
            Add Product
          </button>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
        {product.length > 0 ? (
          product.map((prod, index) => (
            <div
              key={index}
              className="border p-4 rounded-3xl shadow-md hover:shadow-lg transition duration-300 bg-black"
            >
              <img
                src={prod.imageURL}
                className="h-40 w-full object-cover mb-4"
                alt="prod_image"
              />
              <h2 className="text-xl text-blue-500 font-semibold mb-2">
                {prod.title}
              </h2>
              <p className="text-white mb-4">{prod.description}</p>
              <p className="text-gray-300">Price: {prod.price} ETH</p>
              <button
                onClick={() => handleBuy(index)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Buy
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-700 text-center mt-8">
            No products available.
          </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Product Modal"
      >
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProduct();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              className="w-full border p-2 rounded-md"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
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
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
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
              value={newProduct.imageURL}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageURL: e.target.value })
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
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Create Product
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default RetailMart;
