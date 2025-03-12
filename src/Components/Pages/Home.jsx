import React from "react";
import LeftSide from "../LeftSidebar/LeftSide";
import CardSection from "../Main/CardSection";
import Navbar from "../Navbar/Navbar";
import RightSide from "../RightSidebar/RightSide";
import Main from "../Main/Main";

const Home = () => {
  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden">
      <header className="fixed top-0 z-20 w-full bg-white shadow-md">
        <Navbar />
      </header>

      <div className="flex pt-14">
        <aside className="w-[20%] fixed left-0 h-full overflow-y-auto">
          <LeftSide />
        </aside>

        <main className="w-[60%] mx-auto pl-[20%] pr-[20%] h-full overflow-y-auto">
          <CardSection />
          <Main />
        </main>

        <aside className="w-[20%] fixed right-0 h-full overflow-y-auto">
          <RightSide />
        </aside>
      </div>
    </div>
  );
};

export default Home;
