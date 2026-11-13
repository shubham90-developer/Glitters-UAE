import z from "zod";

export const clientsSchema = z.object({
  logo: z.string().optional(),
});

export const updateClientSchema = z.object({
  logo: z.string().optional(),
});
