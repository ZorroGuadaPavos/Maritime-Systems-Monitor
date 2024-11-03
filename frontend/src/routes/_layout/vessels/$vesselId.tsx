import { Switch, Select, Flex, Divider, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { VesselsService, VesselPublic } from "../../../client/index.ts";

// Types
interface VesselState {
  vessel: VesselPublic | null;
  loading: boolean;
  error: string | null;
}

interface EquipmentState {
  selected: string | null;
  identifiers: string[];
  loading: boolean;
  error: string | null;
}

const EQUIPMENT_CATEGORIES = {
  Pipes: (id: string) => id.startsWith("PI"),
  Tanks: (id: string) => id.startsWith("TA"),
  Pumps: (id: string) => id.startsWith("PU"),
  Sea: (id: string) => !id.startsWith("PI") && !id.startsWith("TA") && !id.startsWith("PU"),
} as const;

// Components
interface ValvesListProps {
  valves: VesselPublic['valves'];
  onToggleValve: (identifier: string, isOpen: boolean) => Promise<void>;
}

const ValvesList = ({ valves, onToggleValve }: ValvesListProps) => (
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

interface EquipmentCategoryProps {
  category: string;
  identifiers: string[];
}

const EquipmentCategory = ({ category, identifiers }: EquipmentCategoryProps) => (
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

export const Route = createFileRoute("/_layout/vessels/$vesselId")({
  component: VesselDetail,
});

function VesselDetail() {
  const { vesselId } = useParams<{ vesselId: string }>();
  
  const [vesselState, setVesselState] = useState<VesselState>({
    vessel: null,
    loading: true,
    error: null
  });
  
  const [equipmentState, setEquipmentState] = useState<EquipmentState>({
    selected: null,
    identifiers: [],
    loading: false,
    error: null
  });

  const getVessel = async (id: string) => {
    try {
      const response = await VesselsService.readVessel({ vesselId: id });
      setVesselState({
        vessel: response,
        loading: false,
        error: null
      });
    } catch (err) {
      setVesselState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }));
    }
  };

  const getVesselEquipment = async (
    id: string,
    equipmentId: string | null
  ): Promise<string[] | null> => {
    if (!equipmentId) return null;

    setEquipmentState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await VesselsService.fetchConnectedEquipment({
        vesselId: id,
        equipmentIdentifier: equipmentId
      });
      
      setEquipmentState(prev => ({
        ...prev,
        identifiers: response,
        loading: false,
        error: null
      }));
      
      return response;
    } catch (err) {
      setEquipmentState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }));
      return null;
    }
  };

  const handleToggle = async (valveIdentifier: string, isOpen: boolean) => {
    try {
      const updatedValve = await VesselsService.updateValve({
        vesselId,
        valveIdentifier,
        requestBody: { is_open: isOpen },
      });
      
      setVesselState(prev => ({
        ...prev,
        vessel: prev.vessel ? {
          ...prev.vessel,
          valves: prev.vessel.valves.map(valve =>
            valve.identifier === valveIdentifier ? updatedValve : valve
          ),
        } : null
      }));
      
    } catch (err) {
      setVesselState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error'
      }));
    }
  };

  useEffect(() => {
    getVessel(vesselId);
  }, [vesselId]);

  useEffect(() => {
    if (equipmentState.selected) {
      getVesselEquipment(vesselId, equipmentState.selected);
    }
  }, [equipmentState.selected, vesselId]);

  if (vesselState.loading) return <div>Loading...</div>;
  if (vesselState.error) return <div>Error: {vesselState.error}</div>;
  if (!vesselState.vessel) return <div>No vessel found</div>;

  return (
    <div>
      <h1>{vesselState.vessel.name}</h1>
      <p>ID: {vesselState.vessel.id}</p>
      <p>Version: {vesselState.vessel.version}</p>
      <h1>Valves</h1>
      <Flex gap="4" direction="row" justify="space-between" w="50vw">
        <ValvesList 
          valves={vesselState.vessel.valves}
          onToggleValve={async (identifier, isOpen) => {
            await handleToggle(identifier, isOpen);
            if (equipmentState.selected) {
              getVesselEquipment(vesselId, equipmentState.selected);
            }
          }}
        />
        <Box maxW="560px" minW="560px">
          <Select
            placeholder="Select equipment identifier"
            value={equipmentState.selected || ""}
            onChange={({ target }) => {
              setEquipmentState(prev => ({
                ...prev,
                selected: target.value
              }));
            }}
          >
            {vesselState.vessel.equipment_identifiers.map((identifier) => (
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
                identifiers={equipmentState.identifiers.filter(filterFn)}
              />
            ))}
          </Flex>
        </Box>
      </Flex>
    </div>
  );
}