"use client";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../public/logo.png";
import { useAuth } from "@/lib/auth/context";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const path = usePathname();
  const { user, userProfile, signOut, getUserImage, getDisplayName } =
    useAuth();

  return (
    <div className="p-4 px-10 flex justify-between  items-center shadow-sm fixed top-0 w-full bg-white z-50">
      <div className="flex gap-12 items-center">
        <Link href="/">
          <Image
            src={logo}
            width={130}
            height={130}
            alt="logo"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </Link>
        <ul className="hidden md:flex gap-10 items-center">
          <Link href="/donate">
            <li
              className={`hover:text-primary cursor-pointer ${
                path === "/donate" ? "text-primary" : ""
              }`}
            >
              Donate
            </li>
          </Link>
          <Link href="/rent">
            <li
              className={`hover:text-primary cursor-pointer ${
                path === "/rent" ? "text-primary" : ""
              }`}
            >
              Request
            </li>
          </Link>
          <Link href="/rankings">
            <li
              className={`flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors ${
                path === "/rankings" ? "text-primary" : ""
              }`}
            >
              <Trophy className="w-4 h-4" />
              Rankings
            </li>
          </Link>
          <Link href="/contact-us">
            <li className="hover:text-primary cursor-pointer">Contact Us</li>
          </Link>
        </ul>
      </div>
      <div className="flex gap-2 items-center">
        {!isHomePage && (
          <>
            <Link href={"/add-new-listing"}>
              <Button className="hidden gap-2 md:flex lg:flex">
                <Plus className="w-5 h-5" /> Post Your Ad
              </Button>
            </Link>
            <Link href={"/add-new-listing"}>
              <Button className="block p-[12px] sm:block md:hidden lg:hidden rounded-[100%]">
                <Plus className="w-5" />
              </Button>
            </Link>
          </>
        )}
        {user ? (
          <>
            <Link href="/chat">
              <Button variant="ghost" size="icon" className="relative">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                  <Image
                    src={getUserImage() || "/default-avatar.svg"}
                    width={35}
                    height={35}
                    className="rounded-full"
                    alt="profile"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getDisplayName() || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user" className="w-full cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-orders" className="w-full cursor-pointer">
                    My Orders
                  </Link>
                </DropdownMenuItem>
                {userProfile?.account_type !== 'individual' && (
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="w-full cursor-pointer">
                      Manage Orders
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
