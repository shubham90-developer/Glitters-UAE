import z from "zod";

export const certificatesSchema = z.object({
  certificatesImage: z.string().optional(),
});

export const updateCertificatesSchema = z.object({
  certificatesImage: z.string().optional(),
});
