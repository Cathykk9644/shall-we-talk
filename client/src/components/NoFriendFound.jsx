const NoFriendsFound = () => {
  return (
    <div className="card bg-slate-200 p-6 text-start text-gray-500">
      <h3 className="font-semibold text-xl mb-2">
        <span role="img" className="text-2xl mr-2">
          🙈
        </span>
        Ooops No friends found yet
      </h3>
      <p className="opacity-80 text-gray-500 ">
        Explore further to find new friends or invite your existing friends to
        join the platform for exciting language learning experience.
      </p>
    </div>
  );
};

export default NoFriendsFound;
