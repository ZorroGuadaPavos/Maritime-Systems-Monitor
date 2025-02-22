import { Box, Card, CardBody, SimpleGrid, Switch, Text } from "@chakra-ui/react"
import type React from "react"
import { useCallback, useMemo } from "react"
import type { VesselPublic } from "../../client"

interface ValvesListProps {
  valves: VesselPublic["valves"]
  onToggleValve: (identifier: string, isOpen: boolean) => Promise<void>
}

export const ValvesList = ({ valves, onToggleValve }: ValvesListProps) => {
  const sortedValves = useMemo(() => {
    return [...valves].sort((a, b) => a.identifier.localeCompare(b.identifier))
  }, [valves])

  const handleToggle = useCallback(
    (identifier: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onToggleValve(identifier, e.target.checked)
    },
    [onToggleValve],
  )

  return (
    <Box w="full">
      <SimpleGrid columns={2} spacing={4}>
        {sortedValves.map((valve) => (
          <Card key={valve.identifier}>
            <CardBody
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text color="ui.light">{valve.identifier}</Text>
              <Switch
                value={valve.identifier}
                isChecked={valve.is_open}
                onChange={handleToggle(valve.identifier)}
                colorScheme="uiScheme"
              />
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
}
