import { LineChart } from "lucide-react";
import { ReactNode } from "react";
export function IconButton({
  icon,
  onClick,
  activated
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean
}) {
  return (
    <div className={`
        p-3 rounded-lg  transition-all duration-200 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:ring-opacity-50
        ${
          activated
            ? "bg-blue-500 text-white shadow-lg scale-110"
            : "bg-gray-800 text-gray-600 hover:bg-gray-100 hover:scale-105"
        }
      `} onClick={onClick}>
      {icon}
    </div>
  );
}
