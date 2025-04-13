import React from "react";
import LeftSide from "../LeftSidebar/LeftSide";
import CardSection from "../Main/CardSection";
import Navbar from "../Navbar/Navbar";
import RightSide from "../RightSidebar/RightSide";
import Main from "../Main/Main";

const Home = () => {
  return (
    <div className="w-full">
      <div className="fixed top-0 z-10 w-full bg-[#0f172a]">
        <Navbar></Navbar>
      </div>
      <div className="flex bg-[#0f172a]">
        <div className="flex-auto w-[20%] fixed top-12">
          <LeftSide></LeftSide>
        </div>
          <div className="w-[80%] mx-auto">
        <div className="flex-auto w-[60%] absolute left-[20%] top-14 bg-[#0f172a]  rounded-xl border-2 border-[#bbf7d0]">
     <br/><br/><br/><br/>
            <Main></Main>
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12">
          <RightSide></RightSide>
        </div>
      </div>
    </div>
  );
};

export default Home;
