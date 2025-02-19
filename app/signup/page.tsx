'use client'

import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import {useRouter} from 'next/navigation'
//import { DarkThemeToggle } from "flowbite-react";

const Formi = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [notify,setnotify] = useState<number>(2);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username || !password) {
      console.error('Username and password are required');
      return;
    }

    try {
        const formData = new FormData();
        formData.append("email", username);
        formData.append("password", password);
      const response = await fetch( `https://backend.shancloudservice.com/signup`, {
        method: 'POST',
        body: formData,
      });

      if (response.status !== 200) {
        setnotify(0);
        //throw new Error('Failed to register user');
        
      }

      const data = await response.json();
      console.log('User registered:', data);
      setnotify(1);
      router.push('/signin');

    } catch (err) {
      console.error('Error registering user:', err);
    }
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      //style={{ backgroundImage: "url('/bgimg.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-blue-700 to-blue-400 px-11 py-6 rounded-2xl shadow-xl w-96"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">Sign Up</h2>

        <div className="mb-2 pt-5">
          <label className="block text-white mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-lg bg-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <div className='flex flex-row'>
        <button type="submit" className="text-white h-12 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2 mt-4 w-3/4">
            <span className="mr-2">🔅</span> Sign Up
          </button>
          <Link
            href="/signin"
            className="w-1/4 ml-3 h-12 bg-green-800 text-white p-3 rounded-lg mt-4 hover:bg-gray-800 hover:shadow-lg transition-all flex justify-center items-center"
          >
            Login
          </Link>
           



        </div>

        
      </form>
      <div><p>{notify}</p></div>
    </div>
  );
};

export default Formi;
