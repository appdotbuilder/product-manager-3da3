import { z } from 'zod';

// Currency enum for supported currencies
export const currencySchema = z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NOK']);
export type Currency = z.infer<typeof currencySchema>;

// Product schema with proper numeric handling
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(), // Nullable field for optional descriptions
  price: z.number().positive(), // Stored as numeric in DB, but we use number in TS
  currency: currencySchema,
  created_at: z.coerce.date(), // Automatically converts string timestamps to Date objects
  updated_at: z.coerce.date()
});

export type Product = z.infer<typeof productSchema>;

// Input schema for creating products
export const createProductInputSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().nullable(), // Explicit null allowed, undefined not allowed
  price: z.number().positive('Price must be positive'), // Validate that price is positive
  currency: currencySchema
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

// Input schema for updating products
export const updateProductInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Product name is required').optional(), // Optional = field can be undefined (omitted)
  description: z.string().nullable().optional(), // Can be null or undefined
  price: z.number().positive('Price must be positive').optional(),
  currency: currencySchema.optional()
});

export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

// Schema for deleting products
export const deleteProductInputSchema = z.object({
  id: z.number()
});

export type DeleteProductInput = z.infer<typeof deleteProductInputSchema>;

// Schema for getting a single product
export const getProductInputSchema = z.object({
  id: z.number()
});

export type GetProductInput = z.infer<typeof getProductInputSchema>;