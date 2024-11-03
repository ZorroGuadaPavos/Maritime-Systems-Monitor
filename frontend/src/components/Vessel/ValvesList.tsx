import React, { useMemo, useCallback } from "react";
import { Switch, Box } from "@chakra-ui/react";
import { VesselPublic } from "../../client";

interface ValvesListProps {
  valves: VesselPublic['valves'];
  onToggleValve: (identifier: string, isOpen: boolean) => Promise<void>;
}

export const ValvesList = ({ valves, onToggleValve }: ValvesListProps) => {
  const sortedValves = useMemo(() => {
    return [...valves].sort((a, b) => a.identifier.localeCompare(b.identifier));
  }, [valves]);

  const handleToggle = useCallback(
    (identifier: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onToggleValve(identifier, e.target.checked);
    },
    [onToggleValve]
  );

  return (
    <Box w="full">
      <ul>
        {sortedValves.map((valve) => (
          <li key={valve.identifier}>
            <span>{valve.identifier}</span>
            <Switch
              value={valve.identifier}
              isChecked={valve.is_open}
              onChange={handleToggle(valve.identifier)}
            />
          </li>
        ))}
      </ul>
    </Box>
  );
};