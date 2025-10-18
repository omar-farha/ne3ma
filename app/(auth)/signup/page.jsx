/**
 * صفحة التسجيل
 * هذه الصفحة تسمح للمستخدمين الجدد بإنشاء حساب
 * يمكن الاختيار بين نوعين من الحسابات: فردي أو تجاري (مطعم، صيدلية، مصنع)
 *
 * Sign Up Page
 * This page allows new users to create an account
 * Users can choose between two account types: individual or business (restaurant, pharmacy, factory)
 */

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AccountTypeSelector from "./_components/AccountTypeSelector";
import IndividualSignupForm from "./_components/IndividualSignupForm";
import BusinessSignupForm from "./_components/BusinessSignupForm";
import Link from "next/link";

export default function SignUpPage() {
  const [step, setStep] = useState("accountType"); // "accountType" | "form"
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const router = useRouter();

  const handleAccountTypeSelect = (accountType) => {
    setSelectedAccountType(accountType);
    setStep("form");
  };

  const handleBackToAccountType = () => {
    setStep("accountType");
    setSelectedAccountType("");
  };

  const handleSignupSuccess = (userData) => {
    // Redirect to sign-in page with success message
    router.push("/sign-in?message=Account created successfully! Please check your email to verify your account.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="w-full p-6 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            Ne3ma
          </Link>
          <div className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {step === "accountType" && (
            <AccountTypeSelector onSelect={handleAccountTypeSelect} />
          )}

          {step === "form" && selectedAccountType === "individual" && (
            <IndividualSignupForm
              onBack={handleBackToAccountType}
              onSuccess={handleSignupSuccess}
            />
          )}

          {step === "form" && selectedAccountType !== "individual" && (
            <BusinessSignupForm
              accountType={selectedAccountType}
              onBack={handleBackToAccountType}
              onSuccess={handleSignupSuccess}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full p-6 text-center text-sm text-gray-500">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}