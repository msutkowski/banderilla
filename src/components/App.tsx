import React from 'react';

import { Queue as QueueElement } from './Queue';
import { RedisStats } from './RedisStats';
import { Header } from './Header';
import { useStore } from './hooks/useStore';

import '../index.css';
import '../xcode.css';

export const App = ({
  basePath,
  requestConfig,
}: {
  basePath: string;
  requestConfig?: RequestInit;
}) => {
  const {
    state,
    selectedStatuses,
    setSelectedStatuses,
    promoteJob,
    retryJob,
    retryAll,
    cleanAllDelayed,
    cleanAllFailed,
    cleanAllCompleted,
  } = useStore({ basePath, requestConfig });

  return (
    <>
      <Header />
      <main>
        {state.loading ? (
          'Loading...'
        ) : (
          <>
            {state.data?.stats ? (
              <RedisStats stats={state.data.stats} />
            ) : (
              <>No stats to display </>
            )}

            {state.data?.queues.map(queue => (
              <QueueElement
                queue={queue}
                key={queue.name}
                selectedStatus={selectedStatuses[queue.name]}
                selectStatus={setSelectedStatuses}
                promoteJob={promoteJob(queue.name)}
                retryJob={retryJob(queue.name)}
                retryAll={retryAll(queue.name)}
                cleanAllDelayed={cleanAllDelayed(queue.name)}
                cleanAllFailed={cleanAllFailed(queue.name)}
                cleanAllCompleted={cleanAllCompleted(queue.name)}
              />
            ))}
          </>
        )}
      </main>
    </>
  );
};
