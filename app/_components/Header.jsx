"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import logo from "../../public/logo.png";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
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
  const { user, isSignedIn } = useUser();
  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <div className="p-4 px-10 flex justify-between  items-center shadow-sm fixed top-0 w-full bg-white z-50">
      <div className="flex gap-12 items-center">
        <Link href={"/"}>
          <Image src={logo} width={130} height={130} alt="logo" />
        </Link>
        <ul className="hidden md:flex gap-10">
          <Link href={"/donate"}>
            <li
              className={`"hover:text-primary cursor-pointer" ${
                path == "/donate" && "text-primary"
              }`}
            >
              Donate
            </li>
          </Link>
          <Link href={"/rent"}>
            <li
              className={`"hover:text-primary cursor-pointer" ${
                path == "/rent" && "text-primary"
              }`}
            >
              Request
            </li>
          </Link>
          <li className=" hover:text-primary cursor-pointer">Agent Finder</li>
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
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={user?.imageUrl}
                width={35}
                height={35}
                className="rounded-full"
                alt="profile"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/user"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Shop</DropdownMenuItem>
              <DropdownMenuItem>
                <SignOutButton>Logout</SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
