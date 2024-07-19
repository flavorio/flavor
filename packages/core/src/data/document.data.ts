import { z } from "zod";

//TODO how to describe the store and schema?
export const documentSchema = z.object({
  store: z.any(),
  schema: z.any(),
});

export type DocumentVo = z.infer<typeof documentSchema>;

export const createDocumentSchema = z.object({
  name: z.string(),
  spaceId: z.string(),
  doc: documentSchema,
});

export type CreateDocumentRo = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UpdateDocumentRo = z.infer<typeof updateDocumentSchema>;

export const findDocumentSchema = z.object({
  id: z.string(),
});

export type FindDocumentRo = z.infer<typeof findDocumentSchema>;
