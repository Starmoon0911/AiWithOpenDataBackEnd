// src/app.ts
import express, { Application } from 'express';
import path from 'path';
import fs from 'fs/promises';

const app: Application = express();

async function registerRoutes(dir: string, app: Application, baseRoute = '') {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const routePath = baseRoute + '/' + file.name.replace(/\.[tj]s$/, '');

    if (file.isDirectory()) {
      await registerRoutes(fullPath, app, routePath); // Recursive for nested directories
    } else {
      const routeHandler = await import(fullPath);
      app.use(routePath, routeHandler.default);
    }
  }
}

(async () => {
  await registerRoutes(path.join(__dirname, 'routes'), app);

})();

export default app;
