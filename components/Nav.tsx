import Image from "next/image";
import React from "react";

const Nav = () => {
  return (
    <nav className="w-full h-16 bg-white px-6 lg:flex hidden  items-center">
      <Image
        src={
          "https://static.wixstatic.com/media/7650b3_a6cf687f91264ae08fbd262658eb2bc6~mv2.png/v1/fill/w_168,h_70,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Graviti%20Logo.png"
        }
        alt=""
        width={134}
        height={56}
      />
    </nav>
  );
};

export default Nav;
