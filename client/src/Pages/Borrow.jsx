import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import axios from "axios";

const Borrow = () => {
  const [borrowedINR, setBorrowedINR] = useState("");
  const [showModal, setShowModal] = useState(false);

  const history = useNavigate();

  const handleBorrowINR = () => {
    const usdtAmount = (parseFloat(borrowedINR) / 82.8).toFixed(2);
    setShowModal(true);
  };

  const email = JSON.parse(localStorage.getItem("user")).email;

  const templateParams = {
    from_name: "Faucety",
    from_email: "harshb15003@gmail.com",
    to_email: email,
    message: `You have successfully borrowed INR ${borrowedINR} from Faucety.`,
  };

  const confirmBorrow = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const data = await axios.post("http://localhost:8000/users/borrow", {
      userId: user._id,
      borrowedINR: borrowedINR,
      borrowedUSDT: (parseFloat(borrowedINR) / 82.8).toFixed(2),
    });
    console.log(data);
    emailjs
      .send(
        "harsh_bajwan",
        "template_5mag93f",
        templateParams,
        "LMTMLWyGbr3lo7BG8"
      )
      .then((response) => {
        console.log("Email sent successfully:", response);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
    setShowModal(false);
    history("/");
  };

  return (
    <>
      <Sidebar />
      <div className="flex justify-center mt-10">
        <div className="w-96 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">
            Get loan by Crypto as Collateral
          </h2>
          <div className="mb-4">
            <label
              htmlFor="borrowedINR"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Enter INR Amount to Borrow:
            </label>
            <input
              type="text"
              id="borrowedINR"
              placeholder="Enter Amount"
              value={borrowedINR}
              onChange={(e) => setBorrowedINR(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleBorrowINR}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Borrow INR
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You have to lend {Math.floor(borrowedINR / 82.8)} USDT
                        to borrow the given INR amount. Do you want to confirm?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={confirmBorrow}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Borrow;
