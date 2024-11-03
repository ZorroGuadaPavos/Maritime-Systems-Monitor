import React from "react";
import { Box, Text, Divider } from "@chakra-ui/react";

interface EquipmentCategoryProps {
  category: string;
  identifiers: string[];
}

export const EquipmentCategory = ({ category, identifiers }: EquipmentCategoryProps) => (
  <Box>
    <Text fontWeight="bold">{category}:</Text>
    <Divider />
    {identifiers
      .sort((a, b) => a.localeCompare(b))
      .map((identifier) => (
        <span key={identifier}>{identifier}, </span>
      ))}
  </Box>
);