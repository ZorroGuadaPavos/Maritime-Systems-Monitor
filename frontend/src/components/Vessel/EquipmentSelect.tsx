import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
} from "@chakra-ui/react"
import { useMemo } from "react"
import { EquipmentCategory } from "./EquipmentCategory"

export const EQUIPMENT_CATEGORIES = {
  Pipes: (id: string) => id.startsWith("PI"),
  Tanks: (id: string) => id.startsWith("TA"),
  Pumps: (id: string) => id.startsWith("PU"),
  Sea: (id: string) =>
    !id.startsWith("PI") && !id.startsWith("TA") && !id.startsWith("PU"),
} as const

interface EquipmentSelectProps {
  equipmentIdentifiers: string[]
  selectedEquipment: string | null
  connectedEquipment: string[]
  onEquipmentSelect: (value: string) => void
}

export const EquipmentSelect = ({
  equipmentIdentifiers,
  selectedEquipment,
  connectedEquipment,
  onEquipmentSelect,
}: EquipmentSelectProps) => {
  const equipmentCategories = useMemo(() => {
    return Object.entries(EQUIPMENT_CATEGORIES).map(([category, filterFn]) => ({
      category,
      identifiers: connectedEquipment
        .filter(filterFn)
        .sort((a, b) => a.localeCompare(b)),
    }))
  }, [connectedEquipment])

  return (
    <Box w="full">
      <FormControl>
        <FormLabel>Select Equipment Identifier</FormLabel>
        <FormHelperText>
          Select an identifier to view all connected equipment based on the
          valves.
        </FormHelperText>
        <Select
          placeholder="--"
          value={selectedEquipment || ""}
          onChange={(e) => onEquipmentSelect(e.target.value)}
          focusBorderColor="ui.main"
        >
          {equipmentIdentifiers.map((identifier) => (
            <option key={identifier} value={identifier}>
              {identifier}
            </option>
          ))}
        </Select>
      </FormControl>
      <Flex direction="column" w="full" mt={4}>
        {equipmentCategories.map(({ category, identifiers }) => (
          <EquipmentCategory
            key={category}
            category={category}
            identifiers={identifiers}
          />
        ))}
      </Flex>
    </Box>
  )
}
