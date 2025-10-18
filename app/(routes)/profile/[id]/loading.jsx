export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-3 w-full">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto md:mx-0"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mx-auto md:mx-0"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-56"></div>
                <div className="h-4 bg-gray-200 rounded w-60"></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-2">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Listings Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
