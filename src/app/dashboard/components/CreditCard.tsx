"use client";

import React from 'react';

interface CreditCardProps {
  number: string;
  name: string;
  expiry: string;
}

export default function CreditCard({ number, name, expiry }: CreditCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white h-full flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="text-sm opacity-80">Available Balance</div>
        <div className="flex space-x-1">
          <div className="w-6 h-6 bg-red-500 rounded-full opacity-70" />
          <div className="w-6 h-6 bg-yellow-500 rounded-full opacity-70 -ml-2" />
        </div>
      </div>
      
      <div className="text-2xl font-bold my-4">$4,256.78</div>
      
      <div className="mb-6">
        <div className="text-lg tracking-wider mt-4">{number}</div>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs opacity-80">CARD HOLDER</div>
          <div>{name}</div>
        </div>
        <div>
          <div className="text-xs opacity-80">EXPIRES</div>
          <div>{expiry}</div>
        </div>
        <div className="rounded-full bg-white bg-opacity-30 p-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2"/>
            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="white" strokeWidth="2"/>
            <path d="M5 12H9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 5V9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 15V19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
