"use client";

import { redirect } from "next/navigation";
import { FC, Fragment, useEffect } from "react";

const Home: FC = () => {
  useEffect(() => {
    redirect("/auth/login");
  }, []);

  return (
    <Fragment></Fragment>
  );
};

export default Home;