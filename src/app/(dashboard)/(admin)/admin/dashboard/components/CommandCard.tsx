interface CommandCardProps {
  command: any;
  onReject: (command: any) => void;
  onAccept: (command: any) => void;
  onViewDetails: (command: any) => void;
}

export const CommandCard = ({
  command,
  onReject,
  onAccept,
  onViewDetails,
}: CommandCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-[#FD481A] mb-1">
            Reference no : {command.reference}
          </div>
          <div className="text-xs text-gray-400">{command.date}</div>
        </div>
        <button
          onClick={() => onViewDetails(command)}
          className="text-sm font-medium text-gray-900 hover:text-[#FD481A] transition-colors"
        >
          Voir Plus de Details
        </button>
      </div>

      {/* Route */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Depart : {command.departure}
          </span>
        </div>

        <div className="flex items-center gap-3 pl-2.5">
          <div className="w-0.5 h-8 bg-red-300"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#FD481A] bg-[#FD481A] flex items-center justify-center shrink-0">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Arrivée : {command.arrival}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onReject(command)}
          className="flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg hover:bg-[#E63F15] transition-colors"
        >
          Rejeter
        </button>
        <button
          onClick={() => onAccept(command)}
          className="flex-1 py-2.5 px-4 bg-[#FD481A] text-white text-sm font-medium rounded-lg hover:bg-[#E63F15] transition-colors"
        >
          Accepter
        </button>
      </div>
    </div>
  );
};
