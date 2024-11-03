import { Switch, Select, Flex, Divider, Box, Text } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { VesselsService, VesselPublic } from "../../../client/index.ts";

export const Route = createFileRoute("/_layout/vessels/$vesselId")({
  component: () => {
    const { vesselId } = useParams<{ vesselId: string }>();
    const [vessel, setVessel] = useState<VesselPublic | null>(null);
    const [equipmentSelected, setEquipmentSelected] = useState<string | null>(
      null
    );
    const [equipmentIdentifiers, setEquipmentIdentifiers] = useState<
      Array<string>
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const getVessel = (vesselId: string) => {
      VesselsService.readVessel({ vesselId })
        .then((response) => {
          setVessel(response);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    type EquipmentResponse = Array<string>;

    const getVesselEquipment = async (
      vesselId: string,
      equipmentIdentifier: string | null
    ): Promise<EquipmentResponse | null> => {
      if (!equipmentIdentifier) return null;

      try {
        const response = await VesselsService.fetchConnectedEquipment({
          vesselId,
          equipmentIdentifier,
        });
        setEquipmentIdentifiers(response);
        return response;
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    // Usage in component:
    useEffect(() => {
      if (equipmentSelected) {
        setLoading(true);
        getVesselEquipment(vesselId, equipmentSelected);
      }
    }, [equipmentSelected, vesselId]);

    const handleToggle = async (valveIdentifier: string, isOpen: boolean) => {
      try {
        const updatedValve = await VesselsService.updateValve({
          vesselId,
          valveIdentifier,
          requestBody: { is_open: isOpen },
        });
        setVessel((prev) =>
          prev
            ? {
                ...prev,
                valves: prev.valves.map((valve) =>
                  valve.identifier === valveIdentifier ? updatedValve : valve
                ),
              }
            : prev
        );
      } catch (err: any) {
        setError(err.message);
      }
    };
    const EQUIPMENT_CATEGORIES = {
      Pipes: (id: string) => id.startsWith("PI"),
      Tanks: (id: string) => id.startsWith("TA"),
      Pumps: (id: string) => id.startsWith("PU"),
      Sea: (id: string) =>
        !id.startsWith("PI") && !id.startsWith("TA") && !id.startsWith("PU"),
    } as const;

    // Then, create a reusable EquipmentCategory component
    const EquipmentCategory = ({
      category,
      identifiers,
    }: {
      category: string;
      identifiers: string[];
    }) => (
      <Box key={category}>
        <Text fontWeight="bold">{category}:</Text>
        <Divider />
        {identifiers
          .sort((a, b) => a.localeCompare(b))
          .map((identifier) => (
            <span key={identifier}>{identifier}, </span>
          ))}
      </Box>
    );

    useEffect(() => {
      getVessel(vesselId);
    }, [vesselId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Errors: {error}</div>;
    return (
      <div>
        <h1>{vessel?.name}</h1>
        <p>ID: {vessel?.id}</p>
        <p>Version: {vessel?.version}</p>
        <h1>Valves</h1>
        <Flex gap="4" direction="row" justify="space-between" w="50vw">
          <ul>
            {vessel?.valves
              .sort((a, b) => a.identifier.localeCompare(b.identifier))
              .map((valve) => (
                <li key={valve.identifier}>
                  <span>{valve.identifier}</span>
                  <Switch
                    value={valve.identifier}
                    isChecked={valve.is_open}
                    onChange={async (e) => {
                      await handleToggle(valve.identifier, e.target.checked);
                      getVesselEquipment(vessel?.id, equipmentSelected);
                    }}
                  />
                </li>
              ))}
          </ul>
          <Box maxW="560px" minW="560px">
            <Select
              placeholder="Select equipment identifier"
              value={equipmentSelected || ""} // Add value prop to make it controlled
              onChange={({ target }) => {
                setEquipmentSelected(target.value);
                getVesselEquipment(vessel?.id, target.value);
              }}
            >
              {vessel?.equipment_identifiers.map((identifier) => (
                <option key={identifier} value={identifier}>
                  {identifier}
                </option>
              ))}
            </Select>
            <Flex direction="column">
              {Object.entries(EQUIPMENT_CATEGORIES).map(
                ([category, filterFn]) => (
                  <EquipmentCategory
                    key={category}
                    category={category}
                    identifiers={equipmentIdentifiers.filter(filterFn)}
                  />
                )
              )}
            </Flex>
          </Box>
        </Flex>
      </div>
    );
  },
});
