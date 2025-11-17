// components/DimensionData.tsx
import { UseFormReturn } from "react-hook-form";

interface DimensionDataProps {
  form: UseFormReturn<any>;
}

export const DimensionData = ({ form }: DimensionDataProps) => {
  const { register } = form;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Dimensions de l'article
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          step="0.1"
          placeholder="Poids (kg)"
          {...register("weight", { required: "Le poids est requis" })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
        />
      </div>
    </div>
  );
};

// export const DimensionData = () => {
//   return (
//     <div className="mb-6">
//       <h3 className="text-sm font-semibold text-gray-700 mb-3">
//         Dimensions de l'article
//       </h3>
//       <div className="grid grid-cols-2 gap-3">
//         <input
//           type="text"
//           placeholder="Poids (kg)"
//           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
//         />
//         <input
//           type="text"
//           placeholder="Longueur (cm)"
//           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
//         />
//         <input
//           type="text"
//           placeholder="Hauteur (cm)"
//           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
//         />
//         <input
//           type="text"
//           placeholder="Largeur (cm)"
//           className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FD481A]"
//         />
//       </div>
//     </div>
//   );
// };
