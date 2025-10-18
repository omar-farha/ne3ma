"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Ne3ma ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use Ne3ma for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p className="text-gray-700 mb-4">
                You agree not to disclose your password to any third party and to take sole responsibility for activities and actions under your password,
                whether or not you have authorized such activities or actions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Donation Platform Rules</h2>
              <p className="text-gray-700 mb-4">
                Ne3ma serves as a platform connecting donors with organizations and individuals in need. Users agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate and truthful information about donations and needs</li>
                <li>Not use the platform for fraudulent or misleading purposes</li>
                <li>Respect the privacy and dignity of all users</li>
                <li>Comply with all applicable local laws and regulations</li>
                <li>Not post inappropriate, offensive, or harmful content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Listings</h2>
              <p className="text-gray-700 mb-4">
                Users are solely responsible for the content they post, including donation listings, descriptions, and images.
                By posting content, you grant Ne3ma a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on our platform.
              </p>
              <p className="text-gray-700 mb-4">
                We reserve the right to remove any content that violates these terms or our community guidelines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.
                By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The materials on Ne3ma are provided on an 'as is' basis. Ne3ma makes no warranties, expressed or implied,
                and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability,
                fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Ne3ma or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                or due to business interruption) arising out of the use or inability to use the materials on Ne3ma,
                even if Ne3ma or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications</h2>
              <p className="text-gray-700 mb-4">
                Ne3ma may revise these terms of service at any time without notice. By using this platform,
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: support@ne3ma.com</p>
                <p className="text-gray-700">Address: [Your Company Address]</p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              By using Ne3ma, you acknowledge that you have read and understand these Terms of Service and agree to be bound by them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}