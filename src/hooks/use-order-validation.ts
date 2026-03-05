// hooks/use-order-validation.ts
import { UseFormReturn } from "react-hook-form";
import { OrderFormData } from "./use-order-form";
import { useCallback, useState } from "react";

export const useOrderValidation = () => {
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const validateStep1 = useCallback(
    async (
      form: UseFormReturn<OrderFormData>,
      validateCodepromo: (code: string, setError: any) => Promise<boolean>,
    ): Promise<boolean> => {
      const { watch, setError, getFieldState } = form;
      const errors: Record<string, string> = {};

      // Liste des champs requis pour l'étape 1
      const requiredFields = [
        { name: "articleType", label: "Type d'article" },
        { name: "deliveryCity", label: "Ville de livraison" },
        { name: "deliveryCountry", label: "Pays de livraison" },
        { name: "deliveryName", label: "Nom du destinataire" },
        { name: "deliveryPhone", label: "Téléphone du destinataire" },
        { name: "deliveryType", label: "Type de livraison" },
        { name: "description", label: "Description" },
        { name: "pickupCity", label: "Ville de départ" },
        { name: "pickupCountry", label: "Pays de départ" },
        { name: "pickupName", label: "Nom de l'expéditeur" },
        { name: "pickupPhone", label: "Téléphone de l'expéditeur" },
      ];

      // Vérifier chaque champ requis
      requiredFields.forEach((field) => {
        const value = watch(field.name as keyof OrderFormData);
        if (!value || value === "" || value === null || value === undefined) {
          errors[field.name] = `Ce champ est requis`;
          setError(field.name as any, {
            message: `Ce champ est requis`,
          });
        }
      });

      // Si déjà des erreurs, on ne valide pas le promo
      if (Object.keys(errors).length > 0) {
        return false;
      }

      // Valider le code promo si présent
      const promoCode = watch("promoCodeId");
      if (promoCode && promoCode.trim() !== "") {
        setIsValidatingPromo(true);

        try {
          // Attendre la validation du code promo
          const isValid = await validateCodepromo(promoCode, setError);

          if (!isValid) {
            return false;
          }

          // Vérification supplémentaire : s'assurer qu'il n'y a pas d'erreur
          const promoFieldState = getFieldState("promoCodeId");
          if (promoFieldState.error?.message) {
            return false;
          }

          return true;
        } catch (error) {
          console.error("Erreur validation promo:", error);
          setError("promoCodeId", {
            message: "Erreur lors de la validation du code promo",
          });
          return false;
        } finally {
          setIsValidatingPromo(false);
        }
      }

      return true;
    },
    [],
  );

  return {
    validateStep1,
    isValidatingPromo,
  };
};
