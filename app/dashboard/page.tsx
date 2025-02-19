'use client';

// import { useEffect, useState } from 'react';
// import { NextResponse } from 'next/server';
// import Downfile from '../../components/downfiles';
// import Uploadfile from '../../components/uploadfile';
// import { useRouter } from 'next/navigation';

// interface TokenUser {
//   id: string;
//   email: string;
// }

// const Dashboard = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<TokenUser>();
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchUser() {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/signin');
//         return;
//       }

//       try {
//         const ff = new FormData()
//         ff.append("token",token);
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authenticate`, {
//           method: 'POST',
//           // headers: {
//           //   'Content-Type': 'application/x-www-form-urlencoded',
//           // },
//           body: ff//new URLSearchParams({ token }),
//         }) as NextResponse;

//         if (response.status !== 200) {
//           throw new Error('Unauthorized: Unable to fetch user details');
//         }

//         const data = await response.json();
//         setUser({ id: data.user_id, email: data.email });
//       } catch (err) {
//         console.log(err);
//         //router.push('/signin');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//   }, []);

//   return (
//     <div 
//       className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center text-white p-6"
//       style={{ backgroundImage: "url('/bgimg.jpg')" }}
//     >
//       {loading ? (
//         <p className="text-lg font-semibold animate-pulse">Loading...</p>
//       ) : user ? (
//         <div className="w-full max-w-md bg-white text-gray-900 p-8 rounded-2xl shadow-xl">
//           <h1 className="text-3xl font-bold text-center text-blue-700">Welcome to Your Dashboard</h1>
//           <div className="mt-6 space-y-4">
//             <p className="text-lg font-medium">
//               <span className="text-blue-600 font-semibold">User ID:</span> {String(user.id)}
//             </p>
//             <p className="text-lg font-medium">
//               <span className="text-blue-600 font-semibold">Username:</span> {user.email}
//             </p>
//           </div>

//           <div className="mt-6">
//             <Uploadfile id={user.id} />
//             <Downfile id={user.id} />
//           </div>
//         </div>
//       ) : (
//         <p className="text-lg font-semibold">Unauthorized: No user data available.</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// import { useEffect, useState } from 'react';
// import { NextResponse } from 'next/server';
// import Downfile from '../../components/downfiles';
// import Uploadfile from '../../components/uploadfile';
// import { useRouter } from 'next/navigation';

// interface TokenUser {
//   id: string;
//   email: string;
// }

// const Dashboard = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<TokenUser>();
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchUser() {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/signin');
//         return;
//       }

//       try {
//         const ff = new FormData()
//         ff.append("token",token);
//         const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authenticate`, {
//           method: 'POST',
//           // headers: {
//           //   'Content-Type': 'application/x-www-form-urlencoded',
//           // },
//           body: ff//new URLSearchParams({ token }),
//         }) as NextResponse;

//         if (response.status !== 200) {
//           throw new Error('Unauthorized: Unable to fetch user details');
//         }

//         const data = await response.json();
//         setUser({ id: data.user_id, email: data.email });
//       } catch (err) {
//         console.log(err);
//         //router.push('/signin');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchUser();
//   }, []);

//   return (
//     <div 
//       className="h-auto items-center justify-center bg-cover bg-center text-white p-6"
//       //style={{ backgroundImage: "url('/bgimg.jpg')" }}
//     >
//       {loading ? (
//         <p className="text-lg font-semibold animate-pulse">Loading...</p>
//       ) : user ? (
//         <div className="border-base-300 justify-center block border-t px-4 py-16">
//           <h1 className="text-3xl font-bold text-center text-blue-700">Welcome to Your Dashboard</h1>
//           <div className="mt-6 space-y-4">
//             <p className="text-lg font-medium">
//               <span className="text-blue-600 font-semibold">User ID:</span> {String(user.id)}
//             </p>
//             <p className="text-lg font-medium">
//               <span className="text-blue-600 font-semibold">Username:</span> {user.email}
//             </p>
//           </div>

//           <div className="mt-6 flex">
//             <div className='mr-auto'><Uploadfile id={user.id} /></div>
//             <Downfile id={user.id} />
//           </div>
//         </div>
//       ) : (
//         <p className="text-lg font-semibold">Unauthorized: No user data available.</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import { useEffect, useState } from 'react';
import { NextResponse } from 'next/server';
import Downfile from '@/components/downfiles';
import UploadFile from '@/components/uploadfile';
import { useRouter } from 'next/navigation';

interface TokenUser {
  id: string;
  email: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<TokenUser>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }

      try {
        const ff = new FormData()
        ff.append("token",token);
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
  }, []);

  return (
    <div className="min-h-screen bg-base-300">
      <div className="navbar bg-base-200/50 backdrop-blur-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">V-Cloud</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content text-xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-primary">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a onClick={() => {
                localStorage.removeItem('token');
                router.push('/signin');
              }}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : user ? (
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stats Section */}
            <div className="stats shadow bg-base-200/50 backdrop-blur-sm w-full">
              <div className="stat">
                <div className="stat-title">Storage Used</div>
                <div className="stat-value text-primary">25.6 GB</div>
                <div className="stat-desc">of 100 GB</div>
                <progress className="progress progress-primary w-full mt-2" value="25" max="100"></progress>
              </div>
            </div>

            <div className="stats shadow bg-base-200/50 backdrop-blur-sm w-full">
              <div className="stat">
                <div className="stat-title">Total Files</div>
                <div className="stat-value text-secondary">238</div>
                <div className="stat-desc">↗︎ 40 (30%)</div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="card bg-base-200/50 backdrop-blur-sm shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  Upload Files
                </h2>
                <UploadFile id={user.id} />
              </div>
            </div>

            {/* Download Section */}
            <div className="card bg-base-200/50 backdrop-blur-sm shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  Your Files
                </h2>
                <Downfile id={user.id} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Unauthorized: No user data available.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

