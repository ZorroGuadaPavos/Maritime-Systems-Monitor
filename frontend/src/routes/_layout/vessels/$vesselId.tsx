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

    const getVesselEquipment = (
      vesselId: string,
      equipmentIdentifier: string
    ) => {
      VesselsService.fetchConnectedEquipment({ vesselId, equipmentIdentifier })
        .then((response) => {
          setEquipmentIdentifiers(response);
          console.log("response", response);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

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
              {equipmentIdentifiers.reduce(
                (categories, identifier) => {
                  if (identifier.startsWith("PI")) {
                    categories.Pipes.push(identifier);
                  } else if (identifier.startsWith("T")) {
                    categories.Tanks.push(identifier);
                  } else if (identifier.startsWith("PU")) {
                    categories.Pumps.push(identifier);
                  } else {
                    categories.Sea.push(identifier);
                  }
                  return categories;
                },
                {
                  Pipes: [] as string[],
                  Tanks: [] as string[],
                  Pumps: [] as string[],
                  Sea: [] as string[],
                }
              ) &&
                Object.entries({
                  Pipes: equipmentIdentifiers.filter((id) =>
                    id.startsWith("PI")
                  ),
                  Tanks: equipmentIdentifiers.filter((id) =>
                    id.startsWith("T")
                  ),
                  Pumps: equipmentIdentifiers.filter((id) =>
                    id.startsWith("PU")
                  ),
                  Sea: equipmentIdentifiers.filter(
                    (id) =>
                      !id.startsWith("PI") &&
                      !id.startsWith("T") &&
                      !id.startsWith("PU")
                  ),
                }).map(([category, ids]) => (
                  <Box key={category}>
                    <Text fontWeight="bold">{category}:</Text>
                    <Divider />
                      {ids
                        .sort((a, b) => a.localeCompare(b))
                        .map((identifier) => (
                          <span>{identifier}, </span>
                        ))}
                  </Box>
                ))}
            </Flex>
          </Box>
        </Flex>
      </div>
    );
  },
});
