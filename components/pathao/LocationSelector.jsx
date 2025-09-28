"use client";

import { useState, useEffect } from "react";
import { Select, Form, Spin } from "antd";
import {
  useGetPathaoCitiesQuery,
  useGetPathaoZonesQuery,
  useGetPathaoAreasQuery,
} from "@/redux/api/pathaoApi";

const { Option } = Select;

export default function LocationSelector({
  onLocationChange,
  initialValues = {},
  disabled = false,
  required = true,
}) {
  const [selectedCity, setSelectedCity] = useState(
    initialValues.cityId || null,
  );
  const [selectedZone, setSelectedZone] = useState(
    initialValues.zoneId || null,
  );
  const [selectedArea, setSelectedArea] = useState(
    initialValues.areaId || null,
  );

  // API queries
  const {
    data: citiesResponse,
    isLoading: citiesLoading,
    error: citiesError,
  } = useGetPathaoCitiesQuery();

  // console.log(citiesResponse, "citiesResponse ");

  const {
    data: zonesResponse,
    isLoading: zonesLoading,
    error: zonesError,
  } = useGetPathaoZonesQuery(selectedCity, {
    skip: !selectedCity,
  });

  console.log(zonesResponse, "zonesResponse");

  const {
    data: areasResponse,
    isLoading: areasLoading,
    error: areasError,
  } = useGetPathaoAreasQuery(selectedZone, {
    skip: !selectedZone,
  });

  console.log(areasResponse, "areasResponse");

  // Extract nested data - accounting for axiosBaseQuery wrapper
  const cities = citiesResponse?.data || [];
  const zones = zonesResponse?.data || [];
  const areas = areasResponse?.data || [];

  console.log(areas, "areas");

  // Debug logging
  useEffect(() => {
    if (citiesResponse) {
      // console.log("Cities response:", citiesResponse);
      // console.log("Cities data:", cities);
    }
    if (citiesError) {
      console.error("Cities error:", citiesError);
    }
  }, [citiesResponse, cities, citiesError]);

  // Debug zones response
  useEffect(() => {
    if (zonesResponse) {
      console.log("Zones response:", zonesResponse);
      console.log("Zones data:", zones);
    }
    if (zonesError) {
      console.error("Zones error:", zonesError);
    }
  }, [zonesResponse, zones, zonesError]);

  // Handle city selection
  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    setSelectedZone(null);
    setSelectedArea(null);

    if (onLocationChange) {
      onLocationChange({
        cityId,
        zoneId: null,
        areaId: null,
      });
    }
  };

  // Handle zone selection
  const handleZoneChange = (zoneId) => {
    setSelectedZone(zoneId);
    setSelectedArea(null);

    if (onLocationChange) {
      onLocationChange({
        cityId: selectedCity,
        zoneId,
        areaId: null,
      });
    }
  };

  // Handle area selection
  const handleAreaChange = (areaId) => {
    setSelectedArea(areaId);

    if (onLocationChange) {
      onLocationChange({
        cityId: selectedCity,
        zoneId: selectedZone,
        areaId,
      });
    }
  };

  useEffect(() => {
    // Set initial values only once on mount
    setSelectedCity(initialValues.cityId || selectedCity);
    setSelectedZone(initialValues.zoneId || selectedZone);
    setSelectedArea(initialValues.areaId || selectedArea);
  }, []); // <-- empty dependency array

  return (
    <div className="space-y-4">
      {/* City Selection */}
      <Form.Item
        label="City"
        name="cityId"
        rules={[
          {
            required: required,
            message: "Please select a city",
          },
        ]}
      >
        <Select
          placeholder="Select a city"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={disabled || citiesLoading}
          loading={citiesLoading}
          showSearch
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {Array.isArray(cities)
            ? cities.map((city) => (
                <Option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </Option>
              ))
            : null}
        </Select>
      </Form.Item>

      {/* Zone Selection */}
      <Form.Item
        label="Zone"
        name="zoneId"
        rules={[
          {
            required: required && selectedCity,
            message: "Please select a zone",
          },
        ]}
      >
        <Select
          placeholder="Select a zone"
          value={selectedZone}
          onChange={handleZoneChange}
          disabled={disabled || !selectedCity || zonesLoading}
          loading={zonesLoading}
          showSearch
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {Array.isArray(zones)
            ? zones.map((zone) => (
                <Option key={zone.zone_id} value={zone.zone_id}>
                  {zone.zone_name}
                </Option>
              ))
            : null}
        </Select>
      </Form.Item>

      {/* Area Selection */}
      <Form.Item
        label="Area"
        name="areaId"
        rules={[
          {
            required: required && selectedZone,
            message: "Please select an area",
          },
        ]}
      >
        <Select
          placeholder="Select an area"
          value={selectedArea}
          onChange={handleAreaChange}
          disabled={disabled || !selectedZone || areasLoading}
          loading={areasLoading}
          showSearch
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {Array.isArray(areas)
            ? areas.map((area) => (
                <Option key={area.area_id} value={area.area_id}>
                  {area.area_name}
                </Option>
              ))
            : null}
        </Select>
      </Form.Item>

      {/* Error Messages */}
      {(citiesError || zonesError || areasError) && (
        <div className="text-sm text-red-500">
          {citiesError && (
            <div>Error loading cities: {citiesError.message}</div>
          )}
          {zonesError && <div>Error loading zones: {zonesError.message}</div>}
          {areasError && <div>Error loading areas: {areasError.message}</div>}
        </div>
      )}
    </div>
  );
}
