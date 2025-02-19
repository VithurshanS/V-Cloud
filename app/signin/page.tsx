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
        localStorage.setItem('token', data.token);
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
    <div className="min-h-screen bg-base-300 bg-[url('https://images.unsplash.com/photo-1594788094620-4579ad50c7fe?auto=format&fit=crop&q=80')] bg-cover bg-blend-soft-light flex flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="card w-full max-w-xl glass">
        <div className="card-body">
          <h2 className="card-title text-4xl font-bold justify-center mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              🔐 Login
            </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base-content/80">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input input-bordered w-full bg-base-200/50"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base-content/80">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input input-bordered w-full bg-base-200/50"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/signup"
                className="btn bg-gradient-to-r from-secondary to-accent text-white border-none hover:brightness-110 transition-all duration-300 flex-1"
              >
                Sign Up
              </Link>
              <button
                type="submit"
                className="btn bg-gradient-to-r from-primary to-secondary text-white border-none hover:brightness-110 transition-all duration-300 flex-2"
              >
                🔥 Sign In
              </button>
            </div>
          </form>

          {status && (
            <div className="text-center mt-4">
              <div className="badge badge-success gap-2 p-4 text-lg">
                {status}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;