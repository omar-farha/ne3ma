"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";
import { Loader, Upload, X, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const businessTypeLabels = {
  restaurant: "Restaurant",
  factory: "Factory",
  pharmacy: "Pharmacy",
};

export default function BusinessSignupForm({ accountType, onBack, onSuccess }) {
  const { signUp, uploadFile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [businessImageFile, setBusinessImageFile] = useState(null);
  const [businessImagePreview, setBusinessImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBusinessImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }

    // Validate file size (10MB max for business images)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setBusinessImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setBusinessImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const removeBusinessImage = () => {
    setBusinessImageFile(null);
    setBusinessImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Business address is required";
    }

    if (!businessImageFile) {
      newErrors.businessImage = "Business image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // First, create user account without business image
      const userData = {
        account_type: accountType,
        business_name: formData.businessName.trim(),
        address: formData.address.trim(),
        business_image_path: null, // Will update after file upload
      };

      const result = await signUp(formData.email, formData.password, userData);

      if (result.error) {
        if (result.error.message.includes("already registered")) {
          toast.error("An account with this email already exists");
        } else {
          toast.error(result.error.message || "Failed to create account");
        }
        return;
      }

      // If signup successful and we have a business image, upload it now
      if (businessImageFile && result.data?.user) {
        try {
          const uploadResult = await uploadFile(businessImageFile, "business-images", "images");
          if (uploadResult.error) {
            console.error("Business image upload failed:", uploadResult.error);
            toast.warning("Account created but business image upload failed. You can upload it later from your profile.");
          } else {
            // Update user profile with business image path
            const updateResult = await updateProfile({ business_image_path: uploadResult.data.path });
            if (updateResult.error) {
              console.error("Failed to update profile with business image:", updateResult.error);
            }
          }
        } catch (uploadError) {
          console.error("Business image upload error:", uploadError);
          toast.warning("Account created but business image upload failed. You can upload it later from your profile.");
        }
      }

      toast.success("Account created successfully! Please check your email to verify your account.");

      // Call success callback
      if (onSuccess) {
        onSuccess(result.data);
      }

    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessTypeLabel = businessTypeLabels[accountType] || "Business";

  return (
    <motion.div
      className="max-w-md mx-auto p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create {businessTypeLabel} Account
        </h2>
        <p className="text-gray-600">
          Fill in your business details to join the Ne3ma community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Image Upload */}
        <div className="flex flex-col items-center">
          <Label className="text-sm font-medium mb-2">Business Image *</Label>
          <div className="relative">
            {businessImagePreview ? (
              <div className="relative">
                <Image
                  src={businessImagePreview}
                  alt="Business image preview"
                  width={120}
                  height={80}
                  className="w-32 h-20 rounded-lg object-cover border-4 border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={removeBusinessImage}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBusinessImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {errors.businessImage && (
            <p className="text-red-500 text-sm mt-1">{errors.businessImage}</p>
          )}
        </div>

        {/* Business Name */}
        <div>
          <Label htmlFor="businessName" className="text-sm font-medium">
            {businessTypeLabel} Name *
          </Label>
          <Input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleInputChange}
            className={errors.businessName ? "border-red-500" : ""}
            placeholder={`Enter your ${businessTypeLabel.toLowerCase()} name`}
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Business Email Address *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "border-red-500" : ""}
            placeholder="Enter your business email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-sm font-medium">
            Password *
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "border-red-500" : ""}
              placeholder="Create a password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password *
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={errors.confirmPassword ? "border-red-500" : ""}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium">
            Business Address *
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={errors.address ? "border-red-500" : ""}
            placeholder="Enter your business address"
            rows={3}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}