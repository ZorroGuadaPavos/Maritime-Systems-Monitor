import { Box, Text, Divider, Wrap } from "@chakra-ui/react";

interface EquipmentCategoryProps {
  category: string;
  identifiers: string[];
}

export const EquipmentCategory = ({
  category,
  identifiers,
}: EquipmentCategoryProps) => (
  <Box>
    <Text fontWeight="bold" color="ui.dark">
      {category}:
    </Text>
    <Divider borderColor="ui.main" />
    <Wrap>
      {identifiers.map((identifier) => (
        <Text key={identifier} color="ui.dim">
          {identifier}
        </Text>
      ))}
    </Wrap>
  </Box>
);
