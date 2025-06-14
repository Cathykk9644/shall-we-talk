import { LoaderIcon } from "lucide-react";

function ChatLoader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <LoaderIcon className="animate-spin size-10 text-sky-500" />
      <p className="mt-4 text-center  text-gray-500 ">
        Just a second, trying to connect to chat...
      </p>
    </div>
  );
}

export default ChatLoader;
