'use client';

export default function Home() {
  const scrollToFeatures = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <main className="relative min-h-screen text-center flex flex-col items-center">
      {/* Background Title */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[25rem] leading-none font-bold text-yellow-400/20 tracking-widest select-none"
            style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }}>
          GOLDENEYE
        </h1>
      </div>

      <div className="gif-overlay fixed inset-0 z-0 mix-blend-overlay opacity-50" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center justify-center space-y-16 w-full max-w-6xl mx-auto relative z-10">
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-xl mx-auto">
            <button 
              className="w-48 px-8 py-4 bg-yellow-400 text-black border-2 border-yellow-400 rounded-full 
                hover:bg-transparent hover:text-yellow-400 transition-all duration-300 
                hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-105 text-lg font-semibold
                backdrop-blur-sm">
              Login
            </button>
            <button 
              className="w-48 px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 rounded-full 
                hover:bg-yellow-400 hover:text-black transition-all duration-300 
                hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-105 text-lg font-semibold
                backdrop-blur-sm">
              Sign Up
            </button>
            <button 
              onClick={scrollToFeatures}
              className="w-48 px-8 py-4 bg-black/30 border-2 border-yellow-400 text-yellow-400 rounded-full 
                hover:bg-yellow-400 hover:text-black transition-all duration-300 
                hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-105 text-lg font-semibold
                backdrop-blur-sm">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center">
        {/* Stylish Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15] z-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse z-30"></div>
        
        {/* Content Container */}
        <div className="relative z-40 py-24 px-8 w-full flex flex-col items-center">
          <div className="max-w-7xl w-full mx-auto flex flex-col items-center">            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full">
              {[
                "BET",
                "STREAM",
                "ANALYZE",
                "SECURE",
                "CREATE"
              ].map((feature, index) => (
                <div key={index} 
                  className="aspect-square flex items-center justify-center p-4
                    border border-yellow-400/30 rounded-lg
                    hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] 
                    transition-all duration-500 hover:scale-105 hover:bg-black/60
                    transform-gpu backdrop-blur-sm group">
                  <h3 className="text-2xl text-yellow-400 font-bold group-hover:text-yellow-300 transition-colors duration-300"
                      style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }}>
                    {feature}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Border Effects */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent"></div>
      </section>
    </main>
  );
} 