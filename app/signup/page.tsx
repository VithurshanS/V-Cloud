'use client'

import Link from 'next/link';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [notify, setNotify] = useState<number>(2);

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
      const response = await fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`, {
        method: 'POST',
        body: formData,
      });

      if (response.status !== 200) {
        setNotify(0);
        //throw new Error('Failed to register user');
        
      }

      const data = await response.json();
      console.log('User registered:', data);
      setNotify(1);
      router.push('/signin');

    } catch (err) {
      console.error('Error registering user:', err);
    }
  }

  return (
    
    <div className="min-h-screen bg-base-300 bg-cover bg-blend-soft-light flex flex-col items-center justify-center px-6 py-12 lg:px-8" style={{ backgroundImage: "url('/4882066.jpg')" }}>
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="username">
              Email Address
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
              placeholder="Create a password"
              required
            />
          </div>

          {/* <div className="space-y-4">
            <label className="flex items-start">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500" />
              <span className="ml-2 text-sm text-gray-400">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>
          </div> */}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition duration-200 transform hover:scale-[1.02]"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {notify !== 2 && (
          <div className="mt-4 text-center">
            <div className={`px-4 py-2 rounded-lg ${
              notify === 1 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {notify === 1 ? 'Registration successful! 🎉' : 'Registration failed ❌'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
