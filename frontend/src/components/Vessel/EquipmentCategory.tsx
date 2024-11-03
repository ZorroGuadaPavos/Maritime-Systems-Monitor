import { Box, Text, Divider, HStack } from "@chakra-ui/react";

interface EquipmentCategoryProps {
  category: string;
  identifiers: string[];
}

export const EquipmentCategory = ({ category, identifiers }: EquipmentCategoryProps) => (
  <Box>
    <Text fontWeight="bold">{category}:</Text>
    <Divider />
    <HStack>
      {identifiers.map((identifier) => (
        <Text key={identifier}>{identifier}</Text>
      ))}
    </HStack>
  </Box>
);