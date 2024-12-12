import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-green-600"
      >
        Go Back to Home
      </Link>
    </div>
  );
}

export default ErrorPage;
