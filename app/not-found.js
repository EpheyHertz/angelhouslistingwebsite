import Link from "next/link";
import { Home, Mail, Phone, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-6">
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-8xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <div className="mb-6">
            <Link
              href="/"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 text-center flex items-center justify-center"
            >
              <Home className="mr-2 h-5 w-5" />
              Return to homepage
            </Link>
          </div>

          <div className="flex justify-center">
            <Link
              href="/houses"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center transition duration-200"
            >
              <Search className="mr-2 h-5 w-5" />
              Search for properties
            </Link>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Need assistance?
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4 mr-2" />
              <a
                href="mailto:support@comradehome.me"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
              >
                support@comradehome.me
              </a>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4 mr-2" />
              <a
                href="tel:+254705423479"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
              >
                +254 705 423 479
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}