import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-300 bg-[url('https://images.unsplash.com/photo-1594788094620-4579ad50c7fe?auto=format&fit=crop&q=80')] bg-cover bg-blend-soft-light flex flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="text-center mb-12 backdrop-blur-sm p-8 rounded-3xl">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 animate-pulse">
          V-Cloud
        </h1>
        <p className="text-base-content/80 text-xl">Secure. Scalable. Simple.</p>
      </div>
      
      <div className="card w-96 glass shadow-xl border border-base-content/10">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signin"
              className="btn btn-primary w-full sm:w-auto"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn btn-secondary w-full sm:w-auto"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-base-content/60 text-sm">
        <div className="badge badge-outline gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
          </svg>
          Experience the next generation of cloud computing
        </div>
      </div>
    </div>
  );
}