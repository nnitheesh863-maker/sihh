export interface ConveyorTelemetry {
  deviceId: string;
  conveyorSpeedRpm: number;
  ambientTemperatureC: number;
  ambientHumidityPercent: number;
  cameraFps: number;
  airPressurePsi: number;
  timestamp: string;
}

export class TelemetryService {
  private static recentReadings: ConveyorTelemetry[] = [];
  private static readonly MAX_HISTORY = 100;

  public static ingest(data: ConveyorTelemetry): ConveyorTelemetry {
    const reading = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString()
    };
    this.recentReadings.push(reading);
    if (this.recentReadings.length > this.MAX_HISTORY) {
      this.recentReadings.shift();
    }
    return reading;
  }

  public static getLatest(): ConveyorTelemetry | null {
    if (this.recentReadings.length === 0) {
      return {
        deviceId: 'CONVEYOR-LINE-01',
        conveyorSpeedRpm: 45.2,
        ambientTemperatureC: 28.4,
        ambientHumidityPercent: 62.5,
        cameraFps: 59.8,
        airPressurePsi: 90.0,
        timestamp: new Date().toISOString()
      };
    }
    return this.recentReadings[this.recentReadings.length - 1];
  }

  public static getHistory(): ConveyorTelemetry[] {
    return this.recentReadings;
  }
}
