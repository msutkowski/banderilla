import { setupWorker, rest } from 'msw';

const generateData = (dataKey: string = 'queues') => ({
  stats: {
    redis_version: '4.0.14',
    used_memory: '1128752',
    mem_fragmentation_ratio: '2.41',
    connected_clients: '14',
    blocked_clients: '3',
    total_system_memory: '16712069120',
  },
  [dataKey]: [
    {
      name: 'jobs',
      counts: {
        active: 3,
        completed: 100,
        delayed: 10,
        failed: 0,
        paused: 0,
        waiting: 90000,
      },
      jobs: [],
    },
    {
      name: 'jobs_hours_sensitive',
      counts: {
        active: 1,
        completed: 30,
        delayed: 0,
        failed: 1,
        paused: 1,
        waiting: 10,
      },
      jobs: [],
    },
    {
      name: 'system_events',
      counts: {
        active: 0,
        completed: 0,
        delayed: 0,
        failed: 0,
        paused: 0,
        waiting: 0,
      },
      jobs: [],
    },
  ],
});

export const worker = setupWorker(
  rest.get('/queues', (_req, res, ctx) => {
    return res(ctx.json(generateData()));
  }),
  rest.get('/customDataKey/queues', (_req, res, ctx) => {
    return res(ctx.json(generateData('data')));
  })
);
