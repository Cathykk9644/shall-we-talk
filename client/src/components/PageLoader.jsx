import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgColor1">
      <LoaderIcon className="animate-spin size-16 text-sky-500 " />
    </div>
  );
};
export default PageLoader;
