"use client";

import { useRouter } from "next/navigation";
import Container from "@/components/shared/container";
import Title from "@/components/shared/title";
import OrderForm from "@/components/pathao/OrderForm";

export default function CreatePathaoOrderPage() {
  const router = useRouter();

  const handleOrderCreated = (orderData) => {
    // Redirect to order details page after successful creation
    if (orderData?.id) {
      router.push(`/super-admin/pathao/orders/${orderData.id}`);
    } else {
      // Fallback to orders list if no ID is returned
      router.push("/super-admin/pathao/orders");
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        <Title>Create Pathao Order</Title>
        <OrderForm onOrderCreated={handleOrderCreated} />
      </div>
    </Container>
  );
}
