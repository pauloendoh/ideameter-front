import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import React from "react";
import Navbar from "../layout/Navbar/Navbar";

interface Props {
  test?: string;
}

const HomePage = (props: Props) => {
  const { authUser } = useAuthStore();
  return (
    <div>
      <Navbar />
      {JSON.stringify(authUser)}
    </div>
  );
};

export default HomePage;
