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

export const changeSchema = z.object({
  added: z.record(z.string(), z.record(z.string(), z.any())),
  removed: z.record(z.string(), z.record(z.string(), z.any())),
  updated: z.record(z.string(), z.array(z.record(z.string(), z.any()))),
});

export type ChangeRo = z.infer<typeof changeSchema>;

export const updatesSchema = z.object({
  changes: changeSchema,
  source: z.string(),
});

export type UpdatesRo = z.infer<typeof updatesSchema>;

export const updateDocumentRecordsSchema = z.object({
  id: z.string(),
  updates: z.array(updatesSchema),
});

export type UpdateDocumentRecordsRo = z.infer<
  typeof updateDocumentRecordsSchema
>;
