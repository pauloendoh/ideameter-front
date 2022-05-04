import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import React from "react";
import HomeLayout from "../layout/HomeLayout/HomeLayout";

const HomePage = () => {
  const { authUser } = useAuthStore();
  return <HomeLayout />;
};

export default HomePage;
