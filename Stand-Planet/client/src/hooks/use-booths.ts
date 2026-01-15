import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useBooths(eventId: number) {
  return useQuery({
    queryKey: [api.booths.list.path, eventId],
    queryFn: async () => {
      const url = buildUrl(api.booths.list.path, { eventId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch booths");
      return api.booths.list.responses[200].parse(await res.json());
    },
    enabled: !!eventId,
  });
}

export function useBooth(id: number) {
  return useQuery({
    queryKey: [api.booths.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.booths.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch booth");
      return api.booths.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useUpdateBoothConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, config }: { id: number; config: any }) => {
      const url = buildUrl(api.booths.updateConfig.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configurationJson: config }),
      });
      if (!res.ok) throw new Error("Failed to update booth config");
      return api.booths.updateConfig.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.booths.get.path, data.id] });
    },
  });
}
