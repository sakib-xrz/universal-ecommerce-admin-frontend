// "use client";

// import { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Button,
//   Card,
//   Alert,
//   Spin,
//   InputNumber,
// } from "antd";
// import { Calculator } from "lucide-react";
// import { useCalculatePathaoPriceMutation } from "@/redux/api/pathaoApi";
// import LocationSelector from "./LocationSelector";

// const { Option } = Select;

// // Item types based on Pathao API
// const itemTypes = [
//   { value: 1, label: "Document" },
//   { value: 2, label: "Parcel" },
// ];

// // Delivery types based on Pathao API
// const deliveryTypes = [
//   { value: 48, label: "Normal Delivery (48 hours)" },
//   { value: 24, label: "Express Delivery (24 hours)" },
//   { value: 12, label: "Same Day Delivery (12 hours)" },
// ];

// export default function PriceCalculator({ onPriceCalculated }) {
//   const [form] = Form.useForm();
//   const [calculatedPrice, setCalculatedPrice] = useState(null);
//   const [locationData, setLocationData] = useState({});

//   const [calculatePrice, { isLoading, error }] =
//     useCalculatePathaoPriceMutation();

//   const handleLocationChange = (location) => {
//     setLocationData(location);
//     // Clear previous price when location changes
//     setCalculatedPrice(null);
//   };

//   const handleCalculatePrice = async (values) => {
//     try {
//       const priceData = {
//         item_type: values.itemType,
//         delivery_type: values.deliveryType,
//         item_weight: values.itemWeight.toString(),
//         recipient_city: locationData.cityId,
//         recipient_zone: locationData.zoneId,
//       };

//       const response = await calculatePrice(priceData).unwrap();

//       console.log(response?.data?.data, "response");

//       setCalculatedPrice(response?.data?.data);

//       if (onPriceCalculated) {
//         onPriceCalculated(response);
//       }
//     } catch (err) {
//       console.error("Price calculation failed:", err);
//     }
//   };

//   const resetCalculator = () => {
//     form.resetFields();
//     setCalculatedPrice(null);
//     setLocationData({});
//   };

//   return (
//     <Card
//       title={
//         <div className="flex items-center gap-2">
//           <Calculator className="h-5 w-5" />
//           Delivery Price Calculator
//         </div>
//       }
//       extra={
//         <Button onClick={resetCalculator} size="small">
//           Reset
//         </Button>
//       }
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleCalculatePrice}
//         className="space-y-4"
//       >
//         {/* Location Selection */}
//         <div className="rounded-lg border bg-gray-50 p-4">
//           <h4 className="mb-4 font-medium">Delivery Location</h4>
//           <LocationSelector
//             onLocationChange={handleLocationChange}
//             required={true}
//           />
//         </div>

//         {/* Item Details */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <Form.Item
//             label="Item Type"
//             name="itemType"
//             rules={[
//               {
//                 required: true,
//                 message: "Please select item type",
//               },
//             ]}
//           >
//             <Select placeholder="Select item type">
//               {itemTypes.map((type) => (
//                 <Option key={type.value} value={type.value}>
//                   {type.label}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Delivery Type"
//             name="deliveryType"
//             rules={[
//               {
//                 required: true,
//                 message: "Please select delivery type",
//               },
//             ]}
//           >
//             <Select placeholder="Select delivery type">
//               {deliveryTypes.map((type) => (
//                 <Option key={type.value} value={type.value}>
//                   {type.label}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </div>

//         <Form.Item
//           label="Item Weight (kg)"
//           name="itemWeight"
//           rules={[
//             { required: true, message: "Please enter item weight" },
//             {
//               type: "number",
//               min: 0.5,
//               max: 10,
//               message: "Weight must be between 0.5 and 10 kg",
//             },
//           ]}
//         >
//           <InputNumber
//             min={0.5}
//             max={10}
//             step={0.1}
//             placeholder="Enter weight in kg"
//             style={{ width: "100%" }}
//           />
//         </Form.Item>

//         {/* Calculate Button */}
//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={isLoading}
//             disabled={!locationData.cityId || !locationData.zoneId}
//             className="w-full"
//           >
//             Calculate Price
//           </Button>
//         </Form.Item>

//         {/* Error Display */}
//         {error && (
//           <Alert
//             message="Price Calculation Failed"
//             description={
//               error.message || "Unable to calculate price. Please try again."
//             }
//             type="error"
//             showIcon
//           />
//         )}

//         {/* Price Display */}
//         {/* {calculatedPrice && (
//           <Card className="border-green-200 bg-green-50">
//             <div className="text-center">
//               <h3 className="mb-2 text-lg font-semibold text-green-800">
//                 Calculated Price
//               </h3>
//               <div className="mb-2 text-3xl font-bold text-green-600">
//                 ৳{calculatedPrice.price || calculatedPrice.total_price}
//               </div>
//               {calculatedPrice.breakdown && (
//                 <div className="space-y-1 text-sm text-gray-600">
//                   {calculatedPrice.breakdown.map((item, index) => (
//                     <div key={index} className="flex justify-between">
//                       <span>{item.name}:</span>
//                       <span>৳{item.amount}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <div className="mt-3 text-xs text-gray-500">
//                 * Price may vary based on actual package dimensions and
//                 additional services
//               </div>
//             </div>
//           </Card>
//         )} */}

//         {calculatedPrice && (
//           <Card className="mt-4 border-green-200 bg-green-50">
//             <div className="text-center">
//               <h3 className="mb-2 text-lg font-semibold text-green-800">
//                 Calculated Price
//               </h3>

//               {/* Main final price */}
//               <div className="mb-4 text-3xl font-bold text-green-600">
//                 ৳{calculatedPrice.final_price || calculatedPrice.price}
//               </div>

//               {/* Price breakdown */}
//               <div className="mb-2 space-y-1 text-sm text-gray-700">
//                 <div className="flex justify-between">
//                   <span>Base Price:</span>
//                   <span>৳{calculatedPrice.price}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Discount:</span>
//                   <span>-৳{calculatedPrice.discount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Promo Discount:</span>
//                   <span>-৳{calculatedPrice.promo_discount}</span>
//                 </div>
//                 {calculatedPrice.additional_charge > 0 && (
//                   <div className="flex justify-between">
//                     <span>Additional Charge:</span>
//                     <span>৳{calculatedPrice.additional_charge}</span>
//                   </div>
//                 )}
//                 {calculatedPrice.cod_enabled && (
//                   <div className="flex justify-between">
//                     <span>COD Fee ({calculatedPrice.cod_percentage}%):</span>
//                     <span>
//                       ৳
//                       {Math.round(
//                         (calculatedPrice.cod_percentage / 100) *
//                           calculatedPrice.final_price,
//                       )}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-2 text-sm text-gray-600">
//                 <strong>Final Price:</strong> ৳{calculatedPrice.final_price}
//               </div>

//               <div className="mt-3 text-xs text-gray-500">
//                 * Price may vary based on actual package dimensions and
//                 additional services.
//               </div>
//             </div>
//           </Card>
//         )}
//       </Form>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import { Form, Select, Button, Card, Alert, InputNumber, Spin } from "antd";
import { Calculator } from "lucide-react";
import { useCalculatePathaoPriceMutation } from "@/redux/api/pathaoApi";
import LocationSelector from "./LocationSelector";

const { Option } = Select;

// Item types based on Pathao API
const itemTypes = [
  { value: 1, label: "Document" },
  { value: 2, label: "Parcel" },
];

// Delivery types based on Pathao API
const deliveryTypes = [
  { value: 48, label: "Normal Delivery (48 hours)" },
  { value: 24, label: "Express Delivery (24 hours)" },
  { value: 12, label: "Same Day Delivery (12 hours)" },
];

export default function PriceCalculator({ onPriceCalculated }) {
  const [form] = Form.useForm();
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [locationData, setLocationData] = useState({});

  const [calculatePrice, { isLoading, error }] =
    useCalculatePathaoPriceMutation();

  const handleLocationChange = (location) => {
    setLocationData(location);
    setCalculatedPrice(null); // Clear previous price
  };

  const handleCalculatePrice = async (values) => {
    if (!locationData.cityId || !locationData.zoneId) return;

    try {
      const priceData = {
        item_type: values.itemType,
        delivery_type: values.deliveryType,
        item_weight: values.itemWeight.toString(),
        recipient_city: locationData.cityId,
        recipient_zone: locationData.zoneId,
      };

      const response = await calculatePrice(priceData).unwrap();

      console.log("Price Response:", response);

      // Safely set calculatedPrice
      setCalculatedPrice(response?.data?.data || response);

      if (onPriceCalculated)
        onPriceCalculated(response?.data?.data || response);
    } catch (err) {
      console.error("Price calculation failed:", err);
    }
  };

  const resetCalculator = () => {
    form.resetFields();
    setCalculatedPrice(null);
    setLocationData({});
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Delivery Price Calculator
        </div>
      }
      extra={
        <Button onClick={resetCalculator} size="small">
          Reset
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCalculatePrice}
        className="space-y-4"
      >
        {/* Location Selection */}
        <div className="rounded-lg border bg-gray-50 p-4">
          <h4 className="mb-4 font-medium">Delivery Location</h4>
          <LocationSelector onLocationChange={handleLocationChange} required />
        </div>

        {/* Item Type & Delivery Type */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label="Item Type"
            name="itemType"
            rules={[{ required: true, message: "Please select item type" }]}
          >
            <Select placeholder="Select item type">
              {itemTypes.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Delivery Type"
            name="deliveryType"
            rules={[{ required: true, message: "Please select delivery type" }]}
          >
            <Select placeholder="Select delivery type">
              {deliveryTypes.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Item Weight */}
        <Form.Item
          label="Item Weight (kg)"
          name="itemWeight"
          rules={[
            { required: true, message: "Please enter item weight" },
            {
              type: "number",
              min: 0.5,
              max: 10,
              message: "Weight must be between 0.5 and 10 kg",
            },
          ]}
        >
          <InputNumber
            min={0.5}
            max={10}
            step={0.1}
            placeholder="Enter weight in kg"
            style={{ width: "100%" }}
          />
        </Form.Item>

        {/* Calculate Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? "Calculating..." : "Calculate Price"}
          </Button>
        </Form.Item>

        {/* Error Display */}
        {error && (
          <Alert
            message="Price Calculation Failed"
            description={
              error.message || "Unable to calculate price. Please try again."
            }
            type="error"
            showIcon
          />
        )}

        {/* Price Display */}
        {calculatedPrice && (
          <Card className="mt-4 border-green-200 bg-green-50">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-green-800">
                Calculated Price
              </h3>

              {/* Main final price */}
              <div className="mb-4 text-3xl font-bold text-green-600">
                ৳{calculatedPrice.final_price ?? calculatedPrice.price ?? 0}
              </div>

              {/* Price Breakdown */}
              <div className="mb-2 space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>৳{calculatedPrice.price ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-৳{calculatedPrice.discount ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Promo Discount:</span>
                  <span>-৳{calculatedPrice.promo_discount ?? 0}</span>
                </div>
                {calculatedPrice.additional_charge > 0 && (
                  <div className="flex justify-between">
                    <span>Additional Charge:</span>
                    <span>৳{calculatedPrice.additional_charge}</span>
                  </div>
                )}
                {calculatedPrice.cod_enabled && (
                  <div className="flex justify-between">
                    <span>COD Fee ({calculatedPrice.cod_percentage}%):</span>
                    <span>
                      ৳
                      {Math.round(
                        (calculatedPrice.cod_percentage / 100) *
                          (calculatedPrice.final_price ?? 0),
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <strong>Final Price:</strong> ৳
                {calculatedPrice.final_price ?? 0}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                * Price may vary based on actual package dimensions and
                additional services.
              </div>
            </div>
          </Card>
        )}
      </Form>
    </Card>
  );
}
