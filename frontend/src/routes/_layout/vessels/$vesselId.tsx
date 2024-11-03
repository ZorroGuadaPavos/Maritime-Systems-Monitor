import React, { useCallback } from "react";
import { Flex, Container, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { VesselsService, VesselPublic } from "../../../client/index.ts";
import { ValvesList } from "../../../components/Vessel/ValvesList.tsx";
import { EquipmentSelect } from "../../../components/Vessel/EquipmentSelect.tsx";

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

const useVessel = (vesselId: string) => {
  const [state, setState] = useState<VesselState>({
    vessel: null,
    loading: true,
    error: null
  });

  const updateValve = async (valveIdentifier: string, isOpen: boolean) => {
    try {
      const updatedValve = await VesselsService.updateValve({
        vesselId,
        valveIdentifier,
        requestBody: { is_open: isOpen },
      });
      
      setState(prev => ({
        ...prev,
        vessel: prev.vessel ? {
          ...prev.vessel,
          valves: prev.vessel.valves.map(valve =>
            valve.identifier === valveIdentifier ? updatedValve : valve
          ),
        } : null
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error'
      }));
    }
  };

  useEffect(() => {
    const fetchVessel = async () => {
      try {
        const response = await VesselsService.readVessel({ vesselId });
        setState({
          vessel: response,
          loading: false,
          error: null
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    };

    fetchVessel();
  }, [vesselId]);

  return { state, updateValve };
};

const useEquipment = (vesselId: string) => {
  const [state, setState] = useState<EquipmentState>({
    selected: null,
    identifiers: [],
    loading: false,
    error: null
  });

  const fetchEquipment = async (equipmentId: string | null) => {
    if (!equipmentId) return null;

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await VesselsService.fetchConnectedEquipment({
        vesselId,
        equipmentIdentifier: equipmentId
      });
      
      setState(prev => ({
        ...prev,
        identifiers: response,
        loading: false,
        error: null
      }));
      
      return response;
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }));
      return null;
    }
  };

  const selectEquipment = (value: string | null) => {
    setState(prev => ({
      ...prev,
      selected: value
    }));
  };

  useEffect(() => {
    if (state.selected) {
      fetchEquipment(state.selected);
    }
  }, [state.selected, vesselId]);

  return { state, selectEquipment, fetchEquipment };
};

// Component
function VesselDetail() {
  const { vesselId } = useParams<{ vesselId: string }>();
  
  const { state: vesselState, updateValve } = useVessel(vesselId!);
  const { state: equipmentState, selectEquipment, fetchEquipment } = useEquipment(vesselId);

  const handleValveToggle = useCallback(
    async (identifier: string, isOpen: boolean) => {
      await updateValve(identifier, isOpen);
      if (equipmentState.selected) {
        await fetchEquipment(equipmentState.selected);
      }
    },
    [updateValve, equipmentState.selected, fetchEquipment]
  );

  if (vesselState.loading) return <div>Loading...</div>;
  if (vesselState.error) return <div>Error: {vesselState.error}</div>;
  if (!vesselState.vessel) return <div>No vessel found</div>;

  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <h1>{vesselState.vessel.name}</h1>
          <p>ID: {vesselState.vessel.id}</p>
          <p>Version: {vesselState.vessel.version}</p>
          <h1>Valves</h1>
          <Flex gap="4">
            <Box flex="1">
              <ValvesList 
                valves={vesselState.vessel.valves}
                onToggleValve={handleValveToggle}
              />
            </Box>
            <Box flex="1">
              <EquipmentSelect
                equipmentIdentifiers={vesselState.vessel.equipment_identifiers}
                selectedEquipment={equipmentState.selected}
                connectedEquipment={equipmentState.identifiers}
                onEquipmentSelect={selectEquipment}
              />
            </Box>
          </Flex>
        </Box>
      </Container>
    </>
  );
}

export const Route = createFileRoute("/_layout/vessels/$vesselId")({
  component: VesselDetail,
});