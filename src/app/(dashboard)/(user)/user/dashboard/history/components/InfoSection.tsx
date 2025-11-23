import { ContactCourseInterface, DetailCourseInterface } from "../page";

interface InfoSectionProps {
  title: string;
  data: ContactCourseInterface | null;
}

interface InfoColisProps {
  title: string;
  data: DetailCourseInterface | null;
}

export const InfoSection = ({ title, data }: InfoSectionProps) => {
  if (!data) {
    return "Sélectionnez une commande pour voir les détails";
  }
  return (
    <div className="text-xs">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="titre-bold">Nom :</span>
          <span>{data.nom}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Tel :</span>
          <span>{data.telephone}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Pays :</span>
          <span>{data.pays}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Ville :</span>
          <span>{data.ville}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Quartier :</span>
          <span>{data.quartier}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Rue :</span>
          <span>{data.rue}</span>
        </div>
      </div>
    </div>
  );
};

export const InfoColisSection = ({ title, data }: InfoColisProps) => {
  if (!data) {
    return "Sélectionnez une commande pour voir les détails";
  }
  return (
    <div className="text-xs">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="titre-bold">Service :</span>
          <span>{data.serviceType}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Article :</span>
          <span>{data.articleType}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Transport :</span>
          <span>{data.transportMode}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Livraison :</span>
          <span>{data.deliveryType}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Poids :</span>
          <span>{data.weight}</span>
        </div>

        <div className="flex gap-2">
          <span className="titre-bold">Statut :</span>
          <span>{data.status}</span>
        </div>
      </div>
    </div>
  );
};
