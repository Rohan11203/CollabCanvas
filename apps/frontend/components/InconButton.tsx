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
    <div className={`cursor-pointer ${activated ? "text-red-500" : "text-white" } rounded-full border p-2 bg-black hover:bg-gray-300`} onClick={onClick}>
      {icon}
    </div>
  );
}
