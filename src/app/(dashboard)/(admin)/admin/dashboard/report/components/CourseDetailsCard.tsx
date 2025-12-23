// components/reports/CourseDetailsCard.tsx
import { CourseDetail } from "../lib/parsers/report-parser";
import { Package, MapPin, Clock, DollarSign, User, Hash } from "lucide-react";

interface CourseDetailsCardProps {
  livreurName: string;
  courses: CourseDetail[];
  className?: string;
}

export const CourseDetailsCard = ({
  livreurName,
  courses,
  className = "",
}: CourseDetailsCardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-[#FD481A]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{livreurName}</h3>
          <p className="text-sm text-gray-500">{courses.length} course(s)</p>
        </div>
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={`${course.reference}-${index}`}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#FD481A]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  Course #{index + 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{course.time}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">De</p>
                  <p className="text-sm font-medium text-gray-900">
                    {course.from}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FD481A]" />
                <div>
                  <p className="text-xs text-gray-500">À</p>
                  <p className="text-sm font-medium text-gray-900">
                    {course.to}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Montant</p>
                  <p className="text-sm font-bold text-green-700">
                    {course.amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {course.reference}
                </span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {course.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
