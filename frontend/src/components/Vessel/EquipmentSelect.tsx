import React from "react";
import { Select, Box, Flex } from "@chakra-ui/react";
import { EquipmentCategory } from "./EquipmentCategory";

export const EQUIPMENT_CATEGORIES = {
  Pipes: (id: string) => id.startsWith("PI"),
  Tanks: (id: string) => id.startsWith("TA"),
  Pumps: (id: string) => id.startsWith("PU"),
  Sea: (id: string) => !id.startsWith("PI") && !id.startsWith("TA") && !id.startsWith("PU"),
} as const;

interface EquipmentSelectProps {
  equipmentIdentifiers: string[];
  selectedEquipment: string | null;
  connectedEquipment: string[];
  onEquipmentSelect: (value: string) => void;
}

export const EquipmentSelect = ({
  equipmentIdentifiers,
  selectedEquipment,
  connectedEquipment,
  onEquipmentSelect,
}: EquipmentSelectProps) => (
  <Box maxW="560px" minW="560px">
    <Select
      placeholder="Select equipment identifier"
      value={selectedEquipment || ""}
      onChange={(e) => onEquipmentSelect(e.target.value)}
    >
      {equipmentIdentifiers.map((identifier) => (
        <option key={identifier} value={identifier}>
          {identifier}
        </option>
      ))}
    </Select>
    <Flex direction="column">
      {Object.entries(EQUIPMENT_CATEGORIES).map(([category, filterFn]) => (
        <EquipmentCategory
          key={category}
          category={category}
          identifiers={connectedEquipment.filter(filterFn)}
        />
      ))}
    </Flex>
  </Box>
);