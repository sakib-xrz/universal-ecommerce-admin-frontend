"use client";

import { useRouter } from "next/navigation";
import Container from "@/components/shared/container";
import Title from "@/components/shared/title";
import BulkOrderForm from "@/components/pathao/BulkOrderForm";

export default function BulkPathaoOrdersPage() {
  const router = useRouter();

  const handleOrdersCreated = (results) => {
    // Redirect to orders list after bulk creation
    setTimeout(() => {
      router.push("/super-admin/pathao/orders");
    }, 3000); // Give user time to see the results
  };

  return (
    <Container>
      <div className="space-y-6">
        <Title>Bulk Pathao Orders</Title>
        <BulkOrderForm onOrdersCreated={handleOrdersCreated} />
      </div>
    </Container>
  );
}
