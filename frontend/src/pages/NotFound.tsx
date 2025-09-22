import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { ROUTES } from "../router";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-gray-100">
            <span className="text-6xl font-bold text-gray-400">404</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
          <p className="text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <p className="text-sm text-gray-500">
            The page might have been moved, deleted, or you might have entered
            the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <Button
            as={Link}
            to={ROUTES.DASHBOARD}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>

          <div className="text-sm">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              ← Go back
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Need help?</h3>
          <p className="text-xs text-gray-600 mb-3">
            If you think this is an error, please contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 text-xs">
            <Link
              to={ROUTES.PROFILE}
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              Contact Support
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link
              to="/help"
              className="text-blue-600 hover:text-blue-500 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
