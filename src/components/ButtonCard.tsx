import { LucideProps } from "lucide-react";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from "react";

export interface ButtonCardProps {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  id: string;
  selected: string;
  disabled?: boolean;
  setSelected: (value: SetStateAction<string>) => void;
}

export const ButtonCard = ({
  Icon,
  label,
  id,
  selected,
  disabled = false,
  setSelected,
}: ButtonCardProps) => {
  return (
    <span
      onClick={() => !disabled && setSelected(id)}
      className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 rounded-lg transition-all shadow-lg border border-white text-xs sm:text-sm ${
        selected === id
          ? "bg-[#FD481A] text-white border-[#FD481A]"
          : "bg-white text-gray-700 hover:border-[#FD481A]"
      } cursor-pointer`}
    >
      <div
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${
          selected === id ? "bg-white/20" : "bg-[#FD481A]"
        } flex items-center justify-center`}
      >
        <Icon width={10} height={10} className={`text-white`} />
      </div>
      <span className="font-medium text-center sm:text-left">{label}</span>
    </span>
  );
};
