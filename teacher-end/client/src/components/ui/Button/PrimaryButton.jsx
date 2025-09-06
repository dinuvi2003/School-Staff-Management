'use client'

import React from 'react'

const PrimaryButton = ({ content, action }) => {
  return (
    <button
      className="bg-primary text-white h-[46px] px-3 font-semibold text-md rounded hover:bg-blue-700 transition cursor-pointer inline-block"
      onClick={() => action()}
    >
      {content}
    </button>
  );
}

export default PrimaryButton