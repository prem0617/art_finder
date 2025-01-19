"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import NavBar from "./NavBar";

interface CustomComponentProps {
  children: ReactNode;
}

const CustomComponent: React.FC<CustomComponentProps> = ({ children }) => {
  const navbarHideRoute = ["/login", "/signup"];

  const router = useRouter();
  const pathname = usePathname();
  const isTokenAvailable = localStorage.getItem("token");

  // Use useEffect to handle redirects
  useEffect(() => {
    if (!isTokenAvailable && pathname !== "/login" && pathname !== "/signup") {
      router.push("/login");
    } else if (
      isTokenAvailable &&
      (pathname === "/login" || pathname === "/signup")
    ) {
      router.push("/");
    }
  }, [isTokenAvailable, pathname, router]);

  return (
    <div>
      {!navbarHideRoute.includes(pathname) && <NavBar />}
      {children}
    </div>
  );
};

export default CustomComponent;
