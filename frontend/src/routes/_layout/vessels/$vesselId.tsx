import { Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { VesselsService, VesselPublic } from "../../../client/index.ts";

export const Route = createFileRoute("/_layout/vessels/$vesselId")({
  component: () => {
    const { vesselId } = useParams<{ vesselId: string }>();
    const [vessel, setVessel] = useState<VesselPublic | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
      VesselsService.readVessel({ vesselId })
        .then((response) => {
          setVessel(response);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, [vesselId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Errors: {error}</div>;
    return (
      <div>
        <h1>{vessel?.name}</h1>
        <p>ID: {vessel?.id}</p>
        <p>Version: {vessel?.version}</p>
        <h1>Valves</h1>
        <ul>
          {vessel?.valves
            .sort((a, b) => a.identifier.localeCompare(b.identifier))
            .map((valve) => (
              <li key={valve.identifier}>
                <span>{valve.identifier}</span>
                <Switch
                  value={valve.identifier}
                  isChecked={valve.is_open}
                  onChange={(e) =>
                    handleToggle(valve.identifier, e.target.checked)
                  }
                />
              </li>
            ))}
        </ul>
      </div>
    );
  },
});
