import React from "react";

const Footer = () => {
  return (
    <div className="w-full text-center text-xs text-gray-400 font-semibold mb-4">
      &copy; {new Date().getFullYear()} Shall WeTalk. All rights reserved.
    </div>
  );
};

export default Footer;
