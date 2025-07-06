import { LineChart } from "lucide-react";
import { ReactNode } from "react";
export function IconButton({
  icon,
  onClick,
}: {
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <div className="pointer bg-red-500 text-white rounded-full border p-2 bg-black hover:bg-grey" onClick={onClick}>
      {icon}
      ss
    </div>
  );
}
