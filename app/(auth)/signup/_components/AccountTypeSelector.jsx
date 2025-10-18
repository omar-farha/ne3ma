"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  User,
  UtensilsCrossed,
  Factory,
  PillIcon,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const accountTypes = [
  {
    id: "individual",
    title: "Individual",
    description: "Personal account for sharing and receiving items",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    description: "Restaurant business sharing surplus food and ingredients",
    icon: UtensilsCrossed,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    id: "factory",
    title: "Factory",
    description: "Manufacturing business sharing materials and supplies",
    icon: Factory,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    description: "Pharmacy sharing medicines and health products",
    icon: PillIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

export default function AccountTypeSelector({ onSelect }) {
  const [selectedType, setSelectedType] = useState("");

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType && onSelect) {
      onSelect(selectedType);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <motion.h2
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Choose Your Account Type
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Select the type that best describes your account to get started with Ne3ma
        </motion.p>
      </div>

      <RadioGroup value={selectedType} onValueChange={handleSelect} className="space-y-4">
        {accountTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Label
                htmlFor={type.id}
                className={`
                  relative flex items-center p-6 rounded-xl border-2 cursor-pointer
                  transition-all duration-200 hover:shadow-md
                  ${selectedType === type.id
                    ? `${type.borderColor} ${type.bgColor} ring-2 ring-primary ring-opacity-20`
                    : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                <div className="flex items-center space-x-4 w-full">
                  <RadioGroupItem value={type.id} id={type.id} className="sr-only" />

                  <div
                    className={`
                      p-3 rounded-full flex-shrink-0
                      ${selectedType === type.id ? type.bgColor : "bg-gray-100"}
                    `}
                  >
                    <Icon
                      className={`
                        w-6 h-6
                        ${selectedType === type.id ? type.color : "text-gray-600"}
                      `}
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {type.title}
                    </h3>
                    <p className="text-gray-600">
                      {type.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {selectedType === type.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          onClick={handleNext}
          disabled={!selectedType}
          className="px-8 py-3 text-lg font-medium min-w-[200px]"
          size="lg"
        >
          Continue
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}