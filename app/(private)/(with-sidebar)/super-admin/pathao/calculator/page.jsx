"use client";
import Title from "@/components/shared/title";
import PriceCalculator from "@/components/pathao/PriceCalculator";

export default function PathaoCalculatorPage() {
  const handlePriceCalculated = (priceData) => {
    // Optional: Handle price calculation result
    console.log("Price calculated:", priceData);
  };

  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-2xl space-y-6 p-4">
        <Title className="text-center">Pathao Price Calculator</Title>
        <PriceCalculator onPriceCalculated={handlePriceCalculated} />
      </div>
    </div>
  );
}
