import {
  Container,
  Heading,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

import { VesselsService } from "../../../client/index.ts";
import { PaginationFooter } from "../../../components/Common/PaginationFooter.tsx";

const vesselsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/vessels/")({
  component: Vessels,
  validateSearch: (search) => vesselsSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getVesselsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      VesselsService.readVessels({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["vessels", { page }],
  };
}

function VesselsTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    });

  const {
    data: vessels,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getVesselsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && vessels?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getVesselsQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Version</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(4).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
            <Tbody>
              {vessels?.data.map((vessel) => (
                <Tr
                  key={vessel.id}
                  opacity={isPlaceholderData ? 0.5 : 1}
                  onClick={() => navigate({ to: `/vessels/${vessel.id}` })}
                  cursor="pointer"
                >
                  <Td>{vessel.id}</Td>
                  <Td isTruncated maxWidth="150px">
                    {vessel.name}
                  </Td>
                  <Td
                    color={!vessel.version ? "ui.dim" : "inherit"}
                    isTruncated
                    maxWidth="150px"
                  >
                    {vessel.version || "N/A"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  );
}

function Vessels() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        Vessels Management
      </Heading>
      <VesselsTable />
    </Container>
  );
}
