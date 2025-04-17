"use client";

import { useState } from "react";
import {
  Check,
  X,
  MapPin,
  Gift,
  Repeat,
  Truck,
  Zap,
  BarChart,
  Mail,
  MessageCircle,
  Eye,
  UserPlus,
  Calendar,
  ShieldCheck,
  Code,
  Megaphone,
  Users,
  CreditCard,
  Wallet,
} from "lucide-react";

const pricingData = {
  clients: {
    title: "Clients / Users",
    plans: [
      {
        name: "Basic",
        price: "225",
        priceDashed: "300",
        features: [
          {
            icon: MapPin,
            label: "Access to donation/request map",
            available: true,
          },
          { icon: Gift, label: "Request surplus items", available: true },
          { icon: Gift, label: "Donate items", available: true },
          {
            icon: Repeat,
            label: "Limited smart match suggestions",
            available: true,
          },
          {
            icon: Truck,
            label: "Real-time logistics tracking",
            available: false,
          },
          { icon: Zap, label: "Priority request matching", available: false },
          {
            icon: BarChart,
            label: "Monthly donation impact report",
            available: false,
          },
          { icon: Mail, label: "Support: Email only", available: true },
          { icon: UserPlus, label: "Max active requests: 3", available: true },
          { icon: Eye, label: "Visibility to NGOs", available: false },
        ],
      },
      {
        name: "Plus",
        price: "500",
        priceDashed: "600",
        features: [
          {
            icon: MapPin,
            label: "Access to donation/request map",
            available: true,
          },
          { icon: Gift, label: "Request surplus items", available: true },
          { icon: Gift, label: "Donate items", available: true },
          {
            icon: Repeat,
            label: "Limited smart match suggestions",
            available: true,
          },
          {
            icon: Truck,
            label: "Real-time logistics tracking",
            available: true,
          },
          { icon: Zap, label: "Priority request matching", available: false },
          {
            icon: BarChart,
            label: "Monthly donation impact report",
            available: true,
          },
          {
            icon: MessageCircle,
            label: "Support: Email + Live Chat",
            available: true,
          },
          { icon: UserPlus, label: "Max active requests: 10", available: true },
          { icon: Eye, label: "Visibility to NGOs", available: true },
        ],
      },
      {
        name: "Pro",
        price: "700",
        priceDashed: "950",
        features: [
          {
            icon: MapPin,
            label: "Access to donation/request map",
            available: true,
          },
          { icon: Gift, label: "Request surplus items", available: true },
          { icon: Gift, label: "Donate items", available: true },
          {
            icon: Repeat,
            label: "Limited smart match suggestions",
            available: true,
          },
          {
            icon: Truck,
            label: "Real-time logistics tracking",
            available: true,
          },
          { icon: Zap, label: "Priority request matching", available: true },
          {
            icon: BarChart,
            label: "Monthly donation impact report",
            available: true,
          },
          {
            icon: MessageCircle,
            label: "Support: Live Chat Priority",
            available: true,
          },
          {
            icon: UserPlus,
            label: "Max active requests: Unlimited",
            available: true,
          },
          { icon: Eye, label: "Visibility to NGOs", available: true },
        ],
      },
    ],
  },
  factories: {
    title: "Factories",
    plans: [
      {
        name: "Starter",
        price: "1,500",
        priceDashed: "2,000",
        features: [
          {
            icon: Gift,
            label: "List surplus items for donation",
            available: true,
          },
          {
            icon: Repeat,
            label: "Smart matching with NGOs/users",
            available: true,
          },
          { icon: Truck, label: "Logistics coordination", available: false },
          {
            icon: BarChart,
            label: "Dashboard for donation tracking",
            available: true,
          },
          {
            icon: Calendar,
            label: "Custom pickup scheduling",
            available: false,
          },
          {
            icon: ShieldCheck,
            label: "Dedicated account manager",
            available: false,
          },
          {
            icon: Code,
            label: "API integration for warehouse sync",
            available: false,
          },
          {
            icon: BarChart,
            label: "Analytics + ESG impact reports",
            available: false,
          },
          {
            icon: Megaphone,
            label: "Brand promotion on Ne3ma",
            available: false,
          },
          { icon: Users, label: "Team member access: 1", available: true },
        ],
      },
      {
        name: "Growth",
        price: "7,500",
        priceDashed: "10,000",
        features: [
          {
            icon: Gift,
            label: "List surplus items for donation",
            available: true,
          },
          {
            icon: Repeat,
            label: "Smart matching with NGOs/users",
            available: true,
          },
          { icon: Truck, label: "Logistics coordination", available: true },
          {
            icon: BarChart,
            label: "Dashboard for donation tracking",
            available: true,
          },
          {
            icon: Calendar,
            label: "Custom pickup scheduling",
            available: true,
          },
          {
            icon: ShieldCheck,
            label: "Dedicated account manager",
            available: false,
          },
          {
            icon: Code,
            label: "API integration for warehouse sync",
            available: false,
          },
          {
            icon: BarChart,
            label: "Analytics + ESG impact reports",
            available: true,
          },
          {
            icon: Megaphone,
            label: "Brand promotion on Ne3ma",
            available: true,
          },
          { icon: Users, label: "Team member access: 5", available: true },
        ],
      },
      {
        name: "Enterprise",
        price: "15,000",
        priceDashed: "18,000",
        features: [
          {
            icon: Gift,
            label: "List surplus items for donation",
            available: true,
          },
          {
            icon: Repeat,
            label: "Smart matching with NGOs/users",
            available: true,
          },
          { icon: Truck, label: "Logistics coordination", available: true },
          {
            icon: BarChart,
            label: "Dashboard for donation tracking",
            available: true,
          },
          {
            icon: Calendar,
            label: "Custom pickup scheduling",
            available: true,
          },
          {
            icon: ShieldCheck,
            label: "Dedicated account manager",
            available: true,
          },
          {
            icon: Code,
            label: "API integration for warehouse sync",
            available: true,
          },
          {
            icon: BarChart,
            label: "Analytics + ESG impact reports",
            available: true,
          },
          {
            icon: Megaphone,
            label: "Brand promotion on Ne3ma",
            available: true,
          },
          {
            icon: Users,
            label: "Team member access: Unlimited",
            available: true,
          },
        ],
      },
    ],
  },
};

export default function Pricing() {
  const [selectedType, setSelectedType] = useState("clients");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [coupon, setCoupon] = useState("");

  const activePlans = pricingData[selectedType].plans;

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const calculateMonthlyPrice = (price) => {
    const numericPrice = parseInt(price.replace(/,/g, ""));
    return Math.round(numericPrice / 12).toLocaleString();
  };

  return (
    <div className="flex flex-col justify-center items-center py-10 w-full px-4">
      <div className="flex flex-col w-full sm:w-11/12 justify-center items-center">
        <p className="text-primary text-sm font-medium uppercase">
          Simple, Transparent Pricing
        </p>
        <h2 className="text-foreground text-3xl font-semibold leading-snug py-3 md:text-[40px]">
          Plans for Every Need
        </h2>

        <div className="flex flex-row justify-around items-center py-4 w-[15%] max-sm:w-[60%]">
          <button
            type="button"
            onClick={() => setSelectedType("clients")}
            className={`py-1.5 px-4 rounded-3xl border border-primary ${
              selectedType === "clients"
                ? "bg-primary text-white"
                : "hover:bg-primary hover:text-white"
            }`}
          >
            Clients
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("factories")}
            className={`py-1.5 px-4 rounded-3xl border border-primary ml-2 ${
              selectedType === "factories"
                ? "bg-primary text-white"
                : "hover:bg-primary hover:text-white"
            }`}
          >
            Factories
          </button>
        </div>

        <span className="text-sm text-[#4B5675] text-[16px] font-[400] mt-2">
          Save 25% with yearly subscriptions
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="flex flex-col sm:flex-row justify-center items-center sm:items-stretch flex-wrap gap-6 mt-10 w-full">
        {activePlans.map((plan, index) => (
          <div
            key={plan.name}
            onClick={() => handleSelectPlan(plan)}
            className={`flex flex-col justify-center items-center rounded-lg drop-shadow-sm duration-300 p-4 
                w-full sm:w-11/12 md:w-[50%] lg:w-[32%] xl:w-1/4 border border-primary transition-all hover:scale-105 cursor-pointer ${
                  index === 1 ? "bg-[#f16161] text-white" : "text-[#2D3446]"
                }`}
          >
            <h1 className="text-[24px] font-[600] mb-2 max-sm:text-[25px]">
              {plan.name}
            </h1>

            <div className="max-sm:w-[63%] lg:w-[60%] w-full flex flex-row justify-around items-center pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold ">
                {plan.price}{" "}
                <span className="text-xs max-sm:text-sm"> EGP</span>
              </h1>
              <span
                className={`text-xs max-sm:text-[17px] pt-2.5 lg:pl-1 lg:pr-1 ${
                  index === 1 ? "text-white/80" : "text-[#C7CBD4]"
                }`}
              >
                / Mon
              </span>
              <span
                className={`sm:text-[15px] line-through pt-2.5 pr-[6px] font-[500] ${
                  index === 1 ? "text-white/80" : ""
                }`}
              >
                {plan.priceDashed} EGP
              </span>
            </div>

            <ul className="w-full sm:w-11/12 mt-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  {feature.available ? (
                    <span
                      className={`w-6 h-6 rounded-full flex justify-center items-center ${
                        index === 1 ? "bg-white/20" : "bg-[#e8fbf2]"
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          index === 1 ? "text-white" : "text-green-500"
                        }`}
                      />
                    </span>
                  ) : (
                    <span
                      className={`w-6 h-6 rounded-full flex justify-center items-center ${
                        index === 1 ? "bg-white/20" : "bg-[#fde2ea]"
                      }`}
                    >
                      <X
                        className={`w-4 h-4 ${
                          index === 1 ? "text-white" : "text-red-500"
                        }`}
                      />
                    </span>
                  )}
                  <span className="text-m">{feature.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Checkout Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b p-4">
                <h2 className="text-lg font-semibold">Complete Purchase</h2>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-6">
                {/* Plan Selection */}
                <div>
                  <p className="font-medium mb-3">Choose Your Plan</p>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <h6 className="font-medium">{selectedPlan.name}</h6>
                          <p className="text-sm text-gray-500">Monthly Plan</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {selectedPlan.price} EGP
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedPlan.price} EGP / month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-t" />

                {/* Payment Method */}
                <div>
                  <p className="font-medium mb-3">Payment Method</p>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === "credit"
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={paymentMethod === "credit"}
                        onChange={() => setPaymentMethod("credit")}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2">
                        <CreditCard size={20} />
                        <span>Credit Card</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        paymentMethod === "wallet"
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="wallet"
                        checked={paymentMethod === "wallet"}
                        onChange={() => setPaymentMethod("wallet")}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2">
                        <Wallet size={20} />
                        <span>Digital Wallet</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="border rounded-lg overflow-hidden">
                  <input
                    placeholder="Enter promo code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full p-3 outline-none"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal:</p>
                    <p className="font-medium">{selectedPlan.price} EGP</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Total:</p>
                    <p className="font-medium">{selectedPlan.price} EGP</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t p-4">
                <button className="w-full bg-primary/80 text-white py-2 rounded-md hover:bg-primary">
                  Pay {selectedPlan.price} EGP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
