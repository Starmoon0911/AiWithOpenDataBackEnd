import express, { Application, Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import Table from 'ascii-table';

const app: Application = express();

// 註冊路由函式
async function registerRoutes(dir: string, app: Application, baseRoute = '', table: Table) {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    let routePath = baseRoute + '/' + file.name.replace(/\.[tj]s$/, ''); // 去除副檔名

    if (file.isDirectory()) {
      // 如果是資料夾，遞歸處理
      await registerRoutes(fullPath, app, routePath, table);
    } else {
      try {
        // 特別處理 (root).ts，將其路由設為當前目錄路徑
        if (file.name === '(root).ts') {
          routePath = baseRoute; // 將 (root).ts 註冊到當前目錄根路徑
        } else {
          // 處理動態路由：[id].ts -> :id
          routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');
        }

        // 動態匯入路由處理程式
        const routeHandler = await import(fullPath);

        // 確保路由處理程式有 `default` 屬性
        if (routeHandler.default) {
          app.use(routePath, routeHandler.default);

          // 註冊完成後在表格中顯示狀態
          routeHandler.default.stack.forEach((middleware: any) => {
            if (middleware.route) {
              const methods = Object.keys(middleware.route.methods)
                .map(method => method.toUpperCase())
                .join(', ');
              table.addRow(routePath, methods, 'Registered');
            }
          });
        }
      } catch (error) {
        console.error(`Failed to load route from ${fullPath}:`, error);
      }
    }
  }
}

// 主程式
(async () => {
  const table = new Table();
  table.setHeading('API Route', 'Method', 'Status');

  // 註冊 /routes 目錄下的所有路由
  await registerRoutes(path.join(__dirname, 'route'), app, '', table);

  // 顯示註冊路由表格
  console.log(table.toString());
})();

export default app;
