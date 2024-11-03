import {Switch} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { VesselsService, VesselPublic } from "../../../client/index.ts";

export const Route = createFileRoute("/_layout/vessels/$vesselId")({
  component: () => {
    const { vesselId } = useParams<{ vesselId: string }>();
    const [vessel, setVessel] = useState<VesselPublic | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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
        <h2>Valves</h2>
        <pre>{typeof vessel.valves[0].is_open}</pre>
        <ul>
          {vessel?.valves.map((valve) => (
            <li key={valve.identifier}>
              <span>{valve.identifier}</span>
              <Switch  value={valve.identifier} isChecked={valve.is_open}/>
            </li>
          ))}
        </ul>
      </div>
    );
  },
});
