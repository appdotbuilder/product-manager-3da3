import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schema types for validation
import { 
  createProductInputSchema, 
  updateProductInputSchema, 
  deleteProductInputSchema,
  getProductInputSchema 
} from './schema';

// Import handlers
import { createProduct } from './handlers/create_product';
import { getProducts } from './handlers/get_products';
import { getProduct } from './handlers/get_product';
import { updateProduct } from './handlers/update_product';
import { deleteProduct } from './handlers/delete_product';
import { getCurrencies } from './handlers/get_currencies';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Product management endpoints
  createProduct: publicProcedure
    .input(createProductInputSchema)
    .mutation(({ input }) => createProduct(input)),

  getProducts: publicProcedure
    .query(() => getProducts()),

  getProduct: publicProcedure
    .input(getProductInputSchema)
    .query(({ input }) => getProduct(input)),

  updateProduct: publicProcedure
    .input(updateProductInputSchema)
    .mutation(({ input }) => updateProduct(input)),

  deleteProduct: publicProcedure
    .input(deleteProductInputSchema)
    .mutation(({ input }) => deleteProduct(input)),

  // Utility endpoints
  getCurrencies: publicProcedure
    .query(() => getCurrencies()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();