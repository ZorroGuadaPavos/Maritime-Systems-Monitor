import React from "react";
import { Switch } from "@chakra-ui/react";
import { VesselPublic } from "../../client";

interface ValvesListProps {
  valves: VesselPublic['valves'];
  onToggleValve: (identifier: string, isOpen: boolean) => Promise<void>;
}

export const ValvesList = ({ valves, onToggleValve }: ValvesListProps) => (
  <ul>
    {valves
      .sort((a, b) => a.identifier.localeCompare(b.identifier))
      .map((valve) => (
        <li key={valve.identifier}>
          <span>{valve.identifier}</span>
          <Switch
            value={valve.identifier}
            isChecked={valve.is_open}
            onChange={(e) => onToggleValve(valve.identifier, e.target.checked)}
          />
        </li>
      ))}
  </ul>
);