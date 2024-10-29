// src/app.ts
import express, { Application, Router } from 'express';
import path from 'path';
import fs from 'fs/promises';
import Table from 'ascii-table';

const app: Application = express();

async function registerRoutes(dir: string, app: Application, baseRoute = '', table: Table) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const routePath = baseRoute + '/' + file.name.replace(/\.[tj]s$/, '');

    if (file.isDirectory()) {
      await registerRoutes(fullPath, app, routePath, table); 
    } else {
      const routeHandler = await import(fullPath);
      app.use(routePath, routeHandler.default);
      

      routeHandler.default.stack.forEach((middleware: any) => {
        if (middleware.route) {
          const methods = Object.keys(middleware.route.methods).map(method => method.toUpperCase()).join(', ');
          const status = 'Registered';
          table.addRow(routePath, methods, status);
        }
      });
    }
  }
}
(async () => {
  const table = new Table();
  table.setHeading('API Route', 'Method', 'Status');
  await registerRoutes(path.join(__dirname, 'apis'), app, '', table);
  console.log(table.toString());
})();

export default app;
