import React from "react";
import Header from "../components/Header";
import ServicesPage from "./Services";
import DashBoard from "../components/DashBoard";
import Invoice from "../components/Invoice";

const Page = () => {
  return (
    <div>
      <Header />
      {/* <DashBoard /> */}
      <ServicesPage />
      {/* <Invoice /> */}
    </div>
  );
};

export default Page;
