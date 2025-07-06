'use client';

export default function Home() {
  return (
    <main className="relative min-h-screen text-center flex flex-col items-center justify-center">
      {/* Golden Radial Background */}
      <div className="fixed inset-0 z-0" 
           style={{ 
             backgroundImage: 'url("/1751500995260-image.gif")',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat'
           }} />
      
      {/* Dark overlay for better text contrast */}
      <div className="fixed inset-0 z-10 bg-black/40" />
      
      {/* Hero Section */}
      <section className="relative z-20 flex flex-col items-center justify-center space-y-12">
        {/* Main GOLDENEYE Header */}
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-yellow-400 tracking-widest mb-8 
                         drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]
                         animate-pulse"
              style={{ 
                fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4)'
              }}>
            GOLDENEYE
          </h1>
          <p className="text-xl md:text-2xl text-yellow-200 font-semibold tracking-wide">
            For England, James?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          <button 
            className="w-48 px-8 py-4 bg-yellow-400 text-black border-2 border-yellow-400 rounded-full 
              hover:bg-transparent hover:text-yellow-400 transition-all duration-300 
              hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-105 text-lg font-semibold
              backdrop-blur-sm">
            Enter
          </button>
          <button 
            className="w-48 px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 rounded-full 
              hover:bg-yellow-400 hover:text-black transition-all duration-300 
              hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-105 text-lg font-semibold
              backdrop-blur-sm">
            Mission Brief
          </button>
        </div>
      </section>


    </main>
  );
} 