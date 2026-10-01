export interface ExternalSystemRecord {
  sourceId: string;
  sourceSystem: 'AYUSH Research Portal (ARP)' | 'University RMS' | 'Indian Patent Office (IPO) Sync';
  type: 'publication' | 'patent' | 'grant';
  title: string;
  authorOrInventor: string;
  department: string;
  date: string;
  identifier: string; // DOI or Patent No or Grant No
  status: 'Available for Sync' | 'Synced' | 'Validation Error';
}

export const mockExternalRecords: ExternalSystemRecord[] = [
  {
    sourceId: 'ARP-EXT-9081',
    sourceSystem: 'AYUSH Research Portal (ARP)',
    type: 'publication',
    title: 'Standardization and Fingerprinting of Polyherbal Decoctions for Metabolic Syndrome',
    authorOrInventor: 'Dr. Meenakshi Sharma',
    department: 'Dravyaguna Vijnana',
    date: '2025-11-12',
    identifier: '10.1016/j.jep.2025.119041',
    status: 'Available for Sync'
  },
  {
    sourceId: 'IPO-SYNC-4402',
    sourceSystem: 'Indian Patent Office (IPO) Sync',
    type: 'patent',
    title: 'Automated Herb Washing & Fluidized Bed Drying Chamber with Microbial Bio-sensors',
    authorOrInventor: 'Prof. Anand Chaudhary',
    department: 'Rasashastra & Bhaishajya Kalpana',
    date: '2025-10-04',
    identifier: 'App No: 202511099214',
    status: 'Available for Sync'
  },
  {
    sourceId: 'RMS-DELHI-104',
    sourceSystem: 'University RMS',
    type: 'grant',
    title: 'Translational Clinical Trial on Guduchi Ghanavati in Sub-clinical Hypothyroidism',
    authorOrInventor: 'Dr. Santosh Patil',
    department: 'Panchakarma & Clinical Research',
    date: '2025-12-01',
    identifier: 'AYUSH-EMR-2025-412',
    status: 'Available for Sync'
  }
];

export class MockIntegrationAdapter {
  private static syncedIds: Set<string> = new Set();

  public static getAvailableRecords(): ExternalSystemRecord[] {
    return mockExternalRecords.map(r => ({
      ...r,
      status: this.syncedIds.has(r.sourceId) ? 'Synced' : 'Available for Sync'
    }));
  }

  public static markSynced(sourceId: string): void {
    this.syncedIds.add(sourceId);
  }
}
