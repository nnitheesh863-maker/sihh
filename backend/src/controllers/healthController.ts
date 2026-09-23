import { Request, Response } from 'express';
import os from 'os';

export class HealthController {
  public static getHealth(req: Request, res: Response): void {
    const uptimeSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.status(200).json({
      status: 'healthy',
      service: 'sih-onion-grading-backend',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        formatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
        totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024)
      },
      memory: {
        rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      }
    });
  }
}
