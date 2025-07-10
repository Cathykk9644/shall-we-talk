import React, { useRef } from "react";
import { motion } from "framer-motion";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import FriendCard from "./FriendCard";

const FriendSection = ({ friends }) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth;
      const newScrollPosition =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  if (!friends || friends.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">No friends found.</div>
    );
  }

  return (
    <section className="w-full ">
      <div className="flex justify-between items-center mb-4"></div>
      <div
        ref={scrollContainerRef}
        className="flex w-full space-x-4 overflow-x-auto py-4 px-2 sm:px-0 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="min-w-[180px] sm:min-w-[220px] shrink-0 max-w-xs"
          >
            <FriendCard friend={friend} />
          </div>
        ))}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Scroll controls below cards */}
      <div className="flex justify-center items-center mt-2 gap-3">
        <motion.div
          whileTap={{ scale: 0.8 }}
          className="w-8 h-8 rounded-lg bg-sky-400 hover:bg-sky-500 cursor-pointer transition-all duration-100 ease-in-out hover:shadow-lg flex items-center justify-center"
          onClick={() => handleScroll("left")}
        >
          <MdChevronLeft className="text-lg font-bold text-white" />
        </motion.div>
        <span className="mx-1 text-sm text-gray-400 font-bold select-none">
          View Friends
        </span>
        <motion.div
          whileTap={{ scale: 0.8 }}
          className="w-8 h-8 rounded-lg bg-sky-400 hover:bg-sky-500 cursor-pointer transition-all duration-100 ease-in-out hover:shadow-lg flex items-center justify-center"
          onClick={() => handleScroll("right")}
        >
          <MdChevronRight className="font-bold text-white" />
        </motion.div>
      </div>
    </section>
  );
};

export default FriendSection;
