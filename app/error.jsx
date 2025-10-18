"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Something went wrong!</h1>
          <p className="text-gray-600">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-gray-100 p-4 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-red-600 overflow-auto">
                {error?.message || "Unknown error"}
              </pre>
              <pre className="text-gray-500 text-xs mt-2 overflow-auto">
                {error?.stack}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please{" "}
            <Link href="/contact" className="text-primary hover:underline">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}