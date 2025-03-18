"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, Mail, Phone, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-600 p-6">
          <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>

          <div className="mb-8">
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
              onClick={() => reset()}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try again
            </button>
          </div>

          <div className="flex justify-center">
            <Link
              href="/"
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex items-center transition duration-200"
            >
              <Home className="mr-2 h-5 w-5" />
              Return to homepage
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
                className="hover:text-red-600 dark:hover:text-red-400 transition duration-200"
              >
                support@comradehome.me
              </a>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Phone className="h-4 w-4 mr-2" />
              <a
                href="tel:+254705423479"
                className="hover:text-red-600 dark:hover:text-red-400 transition duration-200"
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