"use client";

import { UserButton, UserProfile } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import UserListing from "./_components/UserListing";

function User() {
  return (
    <div className="my-6 md:px-10 lg:px-32 mt-[110px]">
      <h2></h2>
      <UserProfile routing="hash">
        <UserButton.UserProfilePage
          label="My Listing"
          labelIcon={<ShoppingBag className="w-5 h-5" />}
          url="my-listing"
        >
          <UserListing />
        </UserButton.UserProfilePage>
      </UserProfile>
    </div>
  );
}

export default User;
