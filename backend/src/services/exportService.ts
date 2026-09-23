export interface BatchExportData {
  batchId: string;
  batchCode: string;
  farmerName: string;
  date: string;
  totalOnions: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  rejects: number;
  averageDiameterMm: number;
  estimatedWeightKg: number;
  defectsBreakdown: Record<string, number>;
}

export class ExportService {
  public static generateCSV(batch: BatchExportData): string {
    const headers = [
      'Batch ID',
      'Batch Code',
      'Farmer Name',
      'Assessment Date',
      'Total Count',
      'Grade A (Export)',
      'Grade B (Domestic)',
      'Grade C (Processing)',
      'Rejects',
      'Avg Diameter (mm)',
      'Estimated Weight (kg)'
    ];

    const values = [
      batch.batchId,
      batch.batchCode,
      `"${batch.farmerName}"`,
      batch.date,
      batch.totalOnions,
      batch.gradeA,
      batch.gradeB,
      batch.gradeC,
      batch.rejects,
      batch.averageDiameterMm.toFixed(1),
      batch.estimatedWeightKg.toFixed(2)
    ];

    let csv = headers.join(',') + '\n' + values.join(',') + '\n\n';
    csv += 'Defect Type,Count\n';
    for (const [defect, count] of Object.entries(batch.defectsBreakdown)) {
      csv += `${defect},${count}\n`;
    }

    return csv;
  }
}
