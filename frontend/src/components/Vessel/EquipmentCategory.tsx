import { Box, Divider, Text, Wrap } from "@chakra-ui/react"

interface EquipmentCategoryProps {
  category: string
  identifiers: string[]
}

export const EquipmentCategory = ({
  category,
  identifiers,
}: EquipmentCategoryProps) => (
  <Box>
    <Text fontWeight="bold" color="ui.light">
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
)
