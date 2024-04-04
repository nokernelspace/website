import React, { useState, useContext, useEffect } from "react";

export default function Hero({ props }: any) {
  return (
    <div className="flex flex-col m-auto ml-6 border-green">
      <h1 className="block w-full text-4xl text-white">This Is</h1>
      <h1 className="block w-full my-2 text-3xl text-white">
        {" "}
        root
        <wbr />
        @nokernel.space
      </h1>
      <div className="flex flex-col gap-4 my-4 sm:flex-row">
        <div className="flex items-center justify-center text-center text-white bg-black rounded-lg cursor-pointer outline outline-gray-400 border-green min-w-24 min-h-16 invert-out hover:invert-in">
          Blog
        </div>
        <div className="flex items-center justify-center text-center text-white bg-black rounded-lg cursor-pointer outline outline-gray-400 border-green min-w-24 min-h-16 invert-out hover:invert-in">
          Github
        </div>
        <div className="flex items-center justify-center text-center text-white bg-black rounded-lg cursor-pointer outline outline-gray-400 border-green min-w-24 min-h-16 invert-out hover:invert-in">
          Minecraft
        </div>
      </div>
    </div>
  );
}