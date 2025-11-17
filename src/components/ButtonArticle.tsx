import { SetStateAction } from "react";

export interface ButtonArticleProps {
  label: string;
  value: string;
  selected: string;
  setSelected: (value: SetStateAction<string>) => void;
}

export const ButtonArticle = ({
  label,
  value,
  selected,
  setSelected,
}: ButtonArticleProps) => {
  return (
    <span
      onClick={() => setSelected(value)}
      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
        selected === value
          ? "bg-[#FD481A] text-white border-[#FD481A]"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } cursor-pointer`}
    >
      {label}
    </span>
  );
};
