import { JobOptions } from 'bull';
import { JobsOptions, Job as JobMq } from 'bullmq';
import { Status } from 'components/constants';

export interface ValidMetrics {
  total_system_memory: string;
  redis_version: string;
  used_memory: string;
  mem_fragmentation_ratio: string;
  connected_clients: string;
  blocked_clients: string;
}

export interface AppJob {
  id: string | number | undefined;
  timestamp: number | null;
  processedOn: number | null;
  finishedOn: number | null;
  progress: JobMq['progress'];
  attempts: JobMq['attemptsMade'];
  failedReason: JobMq['failedReason'];
  stacktrace: string[] | null;
  opts: JobsOptions | JobOptions;
  data: JobMq['data'];
  name: JobMq['name'];
  delay: number | undefined;
}

export interface AppQueue {
  name: string;
  counts: Record<Status, number>;
  jobs: AppJob[];
}
