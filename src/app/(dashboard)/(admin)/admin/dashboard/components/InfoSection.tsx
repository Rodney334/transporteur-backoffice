interface InfoSectionProps {
  title: string;
  data: any;
}

export const InfoSection = ({ title, data }: InfoSectionProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map((item: any, index: string) => (
          <p key={index} className="text-xs text-gray-600">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};
