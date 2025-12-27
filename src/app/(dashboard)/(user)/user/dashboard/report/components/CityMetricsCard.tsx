// components/reports/CityMetricsCard.tsx
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Route,
  Award,
  Map,
} from "lucide-react";

interface CityMetricsCardProps {
  favoriteCity: string;
  worstCity: string;
  favoriteRoute: string;
  mostFrequentFromCity: string;
  mostFrequentToCity: string;
  totalCities: number;
}

export const CityMetricsCard = ({
  favoriteCity,
  worstCity,
  favoriteRoute,
  mostFrequentFromCity,
  mostFrequentToCity,
  totalCities,
}: CityMetricsCardProps) => {
  const metrics = [
    {
      title: "Ville Favorite",
      value: favoriteCity || "N/A",
      description: "Meilleure performance",
      icon: <Award className="w-5 h-5 text-green-600" />,
      color: "bg-green-100",
      trend: "positive",
    },
    {
      title: "Ville à Améliorer",
      value: worstCity || "N/A",
      description: "Performance en dessous",
      icon: <TrendingDown className="w-5 h-5 text-red-600" />,
      color: "bg-red-100",
      trend: "negative",
    },
    {
      title: "Route Préférée",
      value: favoriteRoute.split("→")[0]?.trim() || "N/A",
      description: favoriteRoute.split("→")[1]?.trim() || "",
      icon: <Route className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-100",
      trend: "neutral",
    },
    {
      title: "Villes Visitée",
      value: totalCities.toString(),
      description: "Villes différentes",
      icon: <Map className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-100",
      trend: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Carte principale */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FD481A]/20 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#FD481A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Métriques des Villes
            </h3>
            <p className="text-sm text-gray-500">
              Analyse géographique des livraisons
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${metric.color}`}>
                  {metric.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{metric.title}</h4>
                  <p className="text-sm text-gray-500">{metric.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {metric.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques de fréquence */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Fréquence des Trajets
            </h3>
            <p className="text-sm text-gray-500">
              Analyse des départs et destinations
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Départs les plus fréquents
            </h4>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900 font-medium">
                {mostFrequentFromCity || "N/A"}
              </span>
              <span className="text-sm text-blue-600 font-medium">
                Départ principal
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Destinations les plus fréquentes
            </h4>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900 font-medium">
                {mostFrequentToCity || "N/A"}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Destination principale
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {totalCities} {totalCities > 1 ? "villes" : "ville"} visitée
                  {totalCities > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
