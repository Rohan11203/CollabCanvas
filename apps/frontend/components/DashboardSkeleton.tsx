export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen relative animate-pulse">
      <div className="absolute top-0 z-[-2]  h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <header className="bg-neutral-900/70 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-neutral-700 rounded-lg"></div>
              <div>
                <div className="h-4 w-24 bg-neutral-700 rounded"></div>
                <div className="h-3 w-40 bg-neutral-700 rounded mt-2"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-neutral-800/50 rounded-lg p-6">
              <div className="h-6 w-1/2 bg-neutral-700 rounded"></div>
              <div className="h-4 w-1/3 bg-neutral-700 rounded mt-4"></div>
              <div className="h-10 w-32 bg-neutral-700 rounded mt-6"></div>
            </div>
          </div>
          {/* Right Panel Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="h-64 bg-neutral-800/50 rounded-lg p-6">
              <div className="h-5 w-2/4 bg-neutral-700 rounded"></div>
              <div className="mt-4 space-y-3">
                <div className="h-8 w-full bg-neutral-700 rounded"></div>
                <div className="h-8 w-full bg-neutral-700 rounded"></div>
                <div className="h-8 w-full bg-neutral-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};