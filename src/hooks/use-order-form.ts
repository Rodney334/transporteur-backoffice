// hooks/use-order-form.ts
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { orderService } from "@/lib/services/order-service";
import { AddressInterface, CreateOrderInterface } from "@/type/order.type";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ArticleType,
  DeliveryType,
  ServiceType,
  TransportMode,
} from "@/type/enum";
import { useOrderStore } from "@/lib/stores/order-store";

// Interface alignée sur l'API
export interface OrderFormData {
  // Informations de base
  transportMode: TransportMode;
  articleType: ArticleType;
  serviceType: ServiceType;
  deliveryType: DeliveryType;
  description: string;
  weight: number;
  zone: string;
  estimatedPrice: number;

  // Adresse de pickup
  pickupName: string;
  pickupPhone: string;
  pickupCountry: string;
  pickupCity: string;
  pickupDistrict: string;
  pickupStreet: string;

  // Adresse de livraison
  deliveryName: string;
  deliveryPhone: string;
  deliveryCountry: string;
  deliveryCity: string;
  deliveryDistrict: string;
  deliveryStreet: string;
}

// Clé pour le localStorage
const LOCAL_STORAGE_KEY = "order-form-data";

// Fonction pour sauvegarder dans le localStorage
const saveToLocalStorage = (data: Partial<OrderFormData>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save form data to localStorage:", error);
  }
};

// Fonction pour charger depuis le localStorage
const loadFromLocalStorage = (): Partial<OrderFormData> | null => {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn("Failed to load form data from localStorage:", error);
    return null;
  }
};

// Fonction pour effacer le localStorage
const clearLocalStorage = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear form data from localStorage:", error);
  }
};

export const useOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const router = useRouter();

  const savedData = loadFromLocalStorage();

  const form = useForm<OrderFormData>({
    defaultValues: {
      transportMode: TransportMode.MOTO,
      articleType: ArticleType.COLIS,
      serviceType: ServiceType.COLIS,
      deliveryType: DeliveryType.STANDARD,
      description: "",
      weight: 0,
      zone: "",
      estimatedPrice: 0,
      pickupName: "",
      pickupPhone: "",
      pickupCountry: "",
      pickupCity: "",
      pickupDistrict: "",
      pickupStreet: "",
      deliveryName: "",
      deliveryPhone: "",
      deliveryCountry: "",
      deliveryCity: "",
      deliveryDistrict: "",
      deliveryStreet: "",
      ...savedData, // Fusionner avec les données sauvegardées
    },
    // defaultValues: {
    //   transportMode: TransportMode.MOTO,
    //   articleType: ArticleType.COLIS,
    //   serviceType: ServiceType.COLIS,
    //   deliveryType: DeliveryType.STANDARD,
    //   description: "Une description",
    //   weight: 0.5,
    //   zone: "",
    //   estimatedPrice: 0,
    //   pickupName: "CC",
    //   pickupPhone: "+229 0197406310",
    //   pickupCountry: "Bénin",
    //   pickupCity: "Cotonou",
    //   pickupDistrict: "1er arrondissement",
    //   pickupStreet: "Etoile rouge",
    //   deliveryName: "L",
    //   deliveryPhone: "+229 0197406310",
    //   deliveryCountry: "Bénin",
    //   deliveryCity: "Abomey-Calavi",
    //   deliveryDistrict: "Akassato",
    //   deliveryStreet: "Carrefour Kérékou",
    // },
  });

  // Sauvegarder automatiquement à chaque changement de valeur
  useEffect(() => {
    const subscription = form.watch((value) => {
      saveToLocalStorage(value);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const calculateEstimatedPrice = (
    serviceType: string,
    deliveryType: string,
    zone: string,
    weight: number
  ): number => {
    // Logique de calcul basée sur la zone et le type de service
    // À adapter selon vos règles métier
    const basePrice = 1000;
    const weightPrice = weight * 500;
    const deliveryMultiplier = deliveryType === "express" ? 1.5 : 1;
    const serviceMultiplier =
      serviceType === "transport" ? 2 : serviceType === "colis" ? 1.5 : 1;

    return Math.round(
      (basePrice + weightPrice) * deliveryMultiplier * serviceMultiplier
    );
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);

    const toastId = toast.loading("Création de la commande en cours...", {
      position: "top-left",
    });

    try {
      const pickupData: AddressInterface = {
        name: data.pickupName,
        phone: data.pickupPhone,
        country: data.pickupCountry,
        city: data.pickupCity,
        district: data.pickupDistrict,
        street: data.pickupStreet,
      };
      const deliveryData: AddressInterface = {
        name: data.deliveryName,
        phone: data.deliveryPhone,
        country: data.deliveryCountry,
        city: data.deliveryCity,
        district: data.deliveryDistrict,
        street: data.deliveryStreet,
      };
      const orderData: CreateOrderInterface = {
        serviceType: data.serviceType,
        description: data.description,
        weight: data.weight,
        pickupAddress: pickupData,
        deliveryAddress: deliveryData,
        deliveryType: data.deliveryType,
        transportMode: data.transportMode,
        articleType: data.articleType,
        zone: data.zone,
        estimatedPrice: data.estimatedPrice,
      };

      await orderService.createOrder(orderData);

      toast.update(toastId, {
        render: "Commande créée avec succès !",
        type: "success",
        isLoading: false,
        autoClose: 7000,
        closeButton: true,
      });

      // Effacer le localStorage après soumission réussie
      clearLocalStorage();

      // Réinitialiser et rediriger
      form.reset();
      setTimeout(() => {
        router.push("/user/dashboard/history");
      }, 2000);
    } catch (error: any) {
      console.log("Erreur création commande:", error);

      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 7000,
        closeButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour effacer manuellement les données sauvegardées
  const clearSavedData = () => {
    clearLocalStorage();
    form.reset();
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    sameAddress,
    setSameAddress,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    calculateEstimatedPrice,
    clearSavedData,
  };
};
