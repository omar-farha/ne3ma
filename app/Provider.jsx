"use client";
import { LoadScript } from "@react-google-maps/api";
import { usePathname } from "next/navigation";

import Header from "./_components/Header";
import ChatBot from "./_components/ChatBot";

function Provider({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        libraries={["places"]}
      >
        {!isAdminRoute && <Header />}
        {!isAdminRoute && <ChatBot />}
        <div className={isAdminRoute ? '' : 'mt-[110px]'}>{children}</div>
      </LoadScript>
    </div>
  );
}

export default Provider;
