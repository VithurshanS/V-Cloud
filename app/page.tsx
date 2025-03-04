import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-base-300 bg-cover bg-blend-soft-light flex flex-col items-center justify-center px-6 py-12 lg:px-8 relative overflow-hidden"
      style={{ backgroundImage: "url('/4882066.jpg')" }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

      {/* Hero Content */}
      <div className="text-center mb-12 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-2xl relative z-10">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-600 animate-pulse drop-shadow-lg">
          V-Cloud
        </h1>
        <p className="text-base-content/80 text-2xl mt-2 font-medium">
          Secure. Scalable. Simple.
        </p>
      </div>

      {/* Card */}
      <div className="card w-96 glass shadow-2xl border border-white/10 relative z-10 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signin"
              className="btn btn-primary w-full sm:w-auto transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn btn-secondary w-full sm:w-auto transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-1/4 left-10 w-16 h-16 bg-blue-500 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-10 right-16 w-24 h-24 bg-pink-500 rounded-full blur-3xl opacity-30 animate-float"></div>
    </div>
  );
}
