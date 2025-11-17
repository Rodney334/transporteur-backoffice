// hooks/use-order-form.ts
import { useState } from "react";
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

export const useOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const router = useRouter();

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
    },
  });

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

      // Réinitialiser et rediriger
      form.reset();
      setTimeout(() => {
        router.push("/user/dashboard/history");
      }, 2000);
    } catch (error: any) {
      console.error("Erreur création commande:", error);

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

  return {
    form,
    currentStep,
    setCurrentStep,
    sameAddress,
    setSameAddress,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    calculateEstimatedPrice,
  };
};
