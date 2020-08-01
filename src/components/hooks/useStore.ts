import { useEffect, useRef, useState, useCallback } from 'react';
import qs from 'querystring';
import { Status } from '../constants';
import { ValidMetrics, AppQueue, AppJob } from 'types';

const interval = 5000;

export type GetQueues = {
  stats: Partial<ValidMetrics>;
  queues: AppQueue[];
} & {
  [key: string]: AppQueue[];
};

type State = {
  data: null | GetQueues;
  loading: boolean;
};

type SelectedStatuses = Record<AppQueue['name'], Status>;

export interface Store {
  state: State;
  promoteJob: (queueName: string) => (job: AppJob) => () => Promise<void>;
  retryJob: (queueName: string) => (job: AppJob) => () => Promise<void>;
  retryAll: (queueName: string) => () => Promise<void>;
  cleanAllDelayed: (queueName: string) => () => Promise<void>;
  cleanAllFailed: (queueName: string) => () => Promise<void>;
  cleanAllCompleted: (queueName: string) => () => Promise<void>;
  selectedStatuses: SelectedStatuses;
  setSelectedStatuses: React.Dispatch<React.SetStateAction<SelectedStatuses>>;
}

export const useStore = ({
  basePath,
  requestConfig,
}: {
  basePath: string;
  requestConfig?: RequestInit;
}): Store => {
  const [state, setState] = useState({
    data: null,
    loading: true,
  } as State);
  const [selectedStatuses, setSelectedStatuses] = useState(
    {} as SelectedStatuses
  );

  const poll = useRef(undefined as undefined | NodeJS.Timeout);
  const stopPolling = () => {
    if (poll.current) {
      clearTimeout(poll.current);
      poll.current = undefined;
    }
  };

  const update = useCallback(
    () =>
      fetch(`${basePath}/queues/?${qs.encode(selectedStatuses)}`, requestConfig)
        .then(res => (res.ok ? res.json() : Promise.reject(res)))
        .then(data => setState({ data, loading: false })),
    [basePath, requestConfig, selectedStatuses]
  );

  useEffect(() => {
    const runPolling = () => {
      update()
        .catch(error => console.error('Failed to poll', error))
        .then(() => {
          const timeoutId = setTimeout(runPolling, interval);
          poll.current = timeoutId;
        });
    };

    stopPolling();
    runPolling();

    return stopPolling;
  }, [selectedStatuses, update]);

  const promoteJob = (queueName: string) => (job: AppJob) => () =>
    fetch(
      `${basePath}/queues/${encodeURIComponent(queueName)}/${job.id}/promote`,
      {
        method: 'put',
        ...requestConfig,
      }
    ).then(update);

  const retryJob = (queueName: string) => (job: AppJob) => () =>
    fetch(
      `${basePath}/queues/${encodeURIComponent(queueName)}/${job.id}/retry`,
      {
        method: 'put',
        ...requestConfig,
      }
    ).then(update);

  const retryAll = (queueName: string) => () =>
    fetch(`${basePath}/queues/${encodeURIComponent(queueName)}/retry`, {
      method: 'put',
      ...requestConfig,
    }).then(update);

  const cleanAllDelayed = (queueName: string) => () =>
    fetch(`${basePath}/queues/${encodeURIComponent(queueName)}/clean/delayed`, {
      method: 'put',
      ...requestConfig,
    }).then(update);

  const cleanAllFailed = (queueName: string) => () =>
    fetch(`${basePath}/queues/${encodeURIComponent(queueName)}/clean/failed`, {
      method: 'put',
      ...requestConfig,
    }).then(update);

  const cleanAllCompleted = (queueName: string) => () =>
    fetch(
      `${basePath}/queues/${encodeURIComponent(queueName)}/clean/completed`,
      {
        method: 'put',
        ...requestConfig,
      }
    ).then(update);

  return {
    state,
    promoteJob,
    retryJob,
    retryAll,
    cleanAllDelayed,
    cleanAllFailed,
    cleanAllCompleted,
    selectedStatuses,
    setSelectedStatuses,
  };
};
