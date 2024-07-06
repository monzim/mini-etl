export interface DataSource {
  id: string;
  user_id: string;
  name: string;
  type: string;
  pgUrl: string;
  s3Bucket: null;
  s3Region: null;
  s3Key: null;
  s3Secret: null;
  connected: boolean;
  lastConnectionCheck: string;
  setupCompleted: boolean;
  setupError: null;
  createdAt: string;
  updatedAt: string;
}

export interface Connetion {
  id: string;
  provider_id: string;
  dataSource_id: string;
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
  syncError: null;
  syncOn: boolean;
  scopes: string[];
  dataSource: Source;
  provider: Provider;
}

interface Provider {
  type: string;
}

interface Source {
  name: string;
  type: string;
}
