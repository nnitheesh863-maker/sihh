export interface QualityAlert {
  id: string;
  batchId: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  type: 'HIGH_DEFECT_RATE' | 'BLACK_MOLD_OUTBREAK' | 'PRICE_SURGE' | 'CALIBRATION_NEEDED';
  message: string;
  timestamp: string;
}

export class AlertNotificationService {
  private static alerts: QualityAlert[] = [];

  public static createAlert(alert: Omit<QualityAlert, 'id' | 'timestamp'>): QualityAlert {
    const newAlert: QualityAlert = {
      ...alert,
      id: 'ALT-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toISOString()
    };
    this.alerts.unshift(newAlert);
    if (this.alerts.length > 50) this.alerts.pop();
    return newAlert;
  }

  public static getRecentAlerts(): QualityAlert[] {
    return this.alerts;
  }
}
