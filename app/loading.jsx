export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-lg font-medium text-gray-700">Loading...</h2>
        <p className="text-sm text-gray-500">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}