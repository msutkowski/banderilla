import { setupWorker, rest } from 'msw';

export const worker = setupWorker(
  rest.get('/queues', (_req, res, ctx) => {
    return res(
      ctx.json({
        stats: {
          redis_version: '4.0.14',
          used_memory: '1128752',
          mem_fragmentation_ratio: '2.41',
          connected_clients: '14',
          blocked_clients: '3',
          total_system_memory: '16712069120',
        },
        queues: [
          {
            name: 'jobs',
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
          {
            name: 'jobs_hours_sensitive',
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
      })
    );
  })
);
