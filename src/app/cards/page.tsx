"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { SideMenu } from "../SideMenu";
    
export default function Cards() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-screen bg">
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="flex-grow p-8 flex justify-center items-center"
      >
        <div className="bg-[#392a76] w-full max-w-4xl p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Cards</h2>
            <div className="flex gap-4">
              <button className="p-2 px-4 rounded-lg bg-green-500 text-white font-semibold">
                Edit limits
              </button>
              <button className="p-2 px-4 rounded-lg bg-green-500 text-white font-semibold">
                Add money
              </button>
            </div>
          </div>

          {/* Card Options */}
          <div className="space-y-6">
            {/* Order a new card */}
            <div className="flex items-center gap-4">
              <div className="p-6 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-3xl font-semibold">+</span>
              </div>
              <div>
                <p className="font-semibold text-white text-lg">Order a new card</p>
                <p className="text-gray-300">Get another card for this account.</p>
              </div>
            </div>

            {/* Existing card */}
            <div className="flex items-center gap-4">
              <div className="p-6 rounded-lg bg-transparent flex items-center justify-center"> {/* Changed bg-gray-700 to bg-transparent */}
                <img
                  src="/flags/MetaPayD-Card.png" // Replace with your actual image path
                  alt="Digital card"
                  className="w-32 h-20 object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-white text-lg">Digital card •••• 9687</p>
                <p className="text-gray-300">Ready to use</p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="mt-8 text-center text-gray-300">
            Is there anything we could do better?{" "}
            <a href="#" className="text-green-400 underline">
              Give us feedback
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
