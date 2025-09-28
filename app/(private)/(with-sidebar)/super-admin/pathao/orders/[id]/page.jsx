"use client";

import { useParams } from "next/navigation";
import Container from "@/components/shared/container";
import Title from "@/components/shared/title";
import OrderDetails from "@/components/pathao/OrderDetails";

export default function PathaoOrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;

  return (
    <Container>
      <div className="space-y-6">
        <Title>Order Details</Title>
        <OrderDetails orderId={orderId} />
      </div>
    </Container>
  );
}
