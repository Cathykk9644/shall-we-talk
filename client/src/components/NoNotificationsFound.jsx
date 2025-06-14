import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-start justify-center py-8 text-start px-4 bg-slate-200 rounded-xl">
      <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <BellIcon className="size-8 text-gray-600 opacity-40 " />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-600">
        No notifications yet
      </h3>
      <p className="opacity-70 max-w-md text-gray-500">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
}

export default NoNotificationsFound;
