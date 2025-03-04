'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Form = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signin`, {
        method: 'POST',
        body: formData,
      });

      if (response.status !== 200) {
        console.log(response);
        throw new Error('Failed to sign in');
      }

      const data = await response.json();
      if (data.token) {
        document.cookie = `token=${data.token}; path=/;`;
        setStatus("Login success 🎉");
        router.push('/dashboard');
      } else {
        const errorMessage = data.message || 'Login failed ❌';
        setStatus(errorMessage);
      }
    } catch (err) {
      console.error('Error signing in:', err);
    }
  }

  return (
    <div className="min-h-screen bg-base-300 bg-cover bg-blend-soft-light flex flex-col items-center justify-center px-6 py-12 lg:px-8" style={{ backgroundImage: "url('/4882066.jpg')" }}>
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Please sign in to your account</p>
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
          placeholder="Enter your password"
          required
        />
        </div>

        <button
        type="submit"
        className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition duration-200 transform hover:scale-[1.02]"
        >
        Sign in
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
          Create account
        </Link>
        </p>
      </div>

      {status && (
        <div className="mt-4 text-center">
        <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400">
          {status}
        </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Form;