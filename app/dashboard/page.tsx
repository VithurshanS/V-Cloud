'use client';

import { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import UploadFile from '@/components/uploadfile';
import { useRouter } from 'next/navigation';
import Downfile from '@/components/downfiles';

interface TokenUser {
  id: string;
  email: string;
}

interface File {
  id: string;
  actualname: string;
  filetype: string;
  date: string;
  fsize: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<TokenUser>();
  const [usersize, setupdatefiles] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [speed, setspeed] = useState<number>(0);
  const [downspeed, setdownspeed] = useState<number>(0);
  const [sharedFiles, setSharedFiles] = useState<File[]>([]);
  const [Refresh, setRefresh] = useState<number>(0);
  const [fileRefresh, setFileRefresh] = useState<number>(0);

  useEffect(() => {
    async function fetchUser() {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (!token) {
        router.push('/signin');
        return;
      }

      try {
        const ff = new FormData();
        ff.append("token", token);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authenticate`, {
          method: 'POST',
          body: ff
        }) as NextResponse;

        if (response.status !== 200) {
          throw new Error('Unauthorized: Unable to fetch user details');
        }

        const data = await response.json();
        setUser({ id: data.user_id, email: data.email });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  useEffect(() => {
    async function fetchSharedFiles() {
      if (!user) return;

      const fd = new FormData();
      fd.append("user_id", user.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-shared-files`, { method: "POST", body: fd });
      if (res.status === 200) {
        const data = await res.json();
        setSharedFiles(data.files || []);
      }
    }

    fetchSharedFiles();
  }, [user, Refresh]);

  async function handleAccept(fileId: string) {
    const fd = new FormData();
    fd.append("file_id", fileId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accept`, { method: "POST", body: fd });
    if (res.ok) {
      setSharedFiles(prev => prev.filter(file => file.id !== fileId));
      setFileRefresh(prev => prev + 1); // Trigger file list refresh
    }
  }

  async function handleReject(fileId: string) {
    const fd = new FormData();
    fd.append("file_id", fileId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reject`, { method: "POST", body: fd });
    if (res.ok) {
      setSharedFiles(prev => prev.filter(file => file.id !== fileId));
    }
  }

  function formatSize(size: number): string {
    if (size === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size * 1024 * 1024) / Math.log(1024));
    return `${(size * 1024 * 1024 / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }

  return (
    <div className="min-h-screen bg-base-300 bg-cover bg-blend-soft-light flex flex-col items-center justify-center px-6 py-12 lg:px-8" style={{ backgroundImage: "url('/4882066.jpg')" }}>
      {/* Navbar */}
      <div className="navbar bg-base-200/30 backdrop-blur-lg border-b border-white/10 fixed top-0 left-0 w-full z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl font-bold text-primary">
            <span className="text-white">V</span>Cloud
          </a>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="badge badge-sm badge-primary indicator-item">2</span>
              </div>
            </label>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar online">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content text-xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200/80 backdrop-blur-lg rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-primary badge-sm">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a onClick={() => {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                router.push('/signin');
              }}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      ) : user ? (
        <div className="container mx-auto p-6">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.email.split('@')[0]}!</h1>
            <p className="text-gray-400">Store and share your files safe & efficiantly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat bg-base-200/30 backdrop-blur-sm rounded-box border border-white/10">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div className="stat-title text-gray-400">Total Storage</div>
              <div className="stat-value text-primary">{formatSize(usersize)}</div>
              <div className="stat-desc text-gray-400">of 100 GB</div>
              <progress className="progress progress-primary w-full mt-2" value={usersize} max={100 * 1024}></progress>
            </div>
            
            <div className="stat bg-base-200/30 backdrop-blur-sm rounded-box border border-white/10">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title text-gray-400">Upload Speed</div>
              <div className="stat-value text-secondary">{speed} MB/s</div>
            </div>
            <div className="stat bg-base-200/30 backdrop-blur-sm rounded-box border border-white/10">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title text-gray-400">Download Speed</div>
              <div className="stat-value text-secondary">{downspeed} MB/s</div>
            </div>
          </div>

          {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <div className="card bg-base-200/30 backdrop-blur-sm shadow-xl border border-white/10 h-full">
              <div className="card-body">
                <h2 className="card-title text-primary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                Upload Files
                </h2>
                <UploadFile id={user.id} uppd={setupdatefiles} spd={setspeed} />
              </div>
              </div>
            </div>

            {/* Shared Files Section */}
            <div className="card bg-base-200/30 backdrop-blur-sm shadow-xl border border-white/10 lg:col-span-2">
              <div className="card-body flex flex-col">
              <div className='flex justify-between items-center h-auto'>
                <h2 className="card-title text-secondary flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Shared Files
                </h2>
                <button className="btn btn-active btn-info" onClick={() => setRefresh(prev => prev + 1)}>Refresh</button>
              </div>
              <div className="overflow-auto h-52">
                {sharedFiles.length > 0 ? (
                <table className="table w-auto">
                  <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {sharedFiles.map((file) => (
                    <tr key={file.id}>
                    <td>{file.actualname}.{file.filetype}</td>
                    <td>{file.date}</td>
                    <td className="flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={() => handleAccept(file.id)}>Accept</button>
                      <button className="btn btn-error btn-sm" onClick={() => handleReject(file.id)}>Reject</button>
                    </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                ) : (
                <p className="text-gray-400 text-sm">No shared files</p>
                )}
              </div>
              </div>
            </div>

            {/* Files Section */}
            <div className="lg:col-span-3">
              <div className="card bg-base-200/30 backdrop-blur-sm shadow-xl border border-white/10">
              <div className="card-body">
                <h2 className="card-title text-accent flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                Your Files
                </h2>
                <Downfile id={user.id} upd={setupdatefiles} num={usersize} spd={setdownspeed} refresh={fileRefresh} />
              </div>
              </div>
            </div>
            </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Unauthorized: Please sign in to access your dashboard.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

