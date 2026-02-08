import { useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../utils/http.js';

export default function NewEventsSection() {
  // tanstack default gives some arguments to the query function, including signal for aborting fetch requests
  const { data, error, isError, isPending, refetch } = useQuery({
    // used for caching and identifying the query
    // the query key consists of a string and can also include variables, which is useful for dynamic queries
    queryKey: ['events'],
    queryFn: fetchEvents,
    // the time in milliseconds after which the cached data is considered stale and will be refetched on the next query
    staleTime: 1000 * 5, // 5 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes, the time after which the cached data will be garbage collected if not used
    // automatically refetch the data every 5 seconds to keep it up-to-date, default is false
    // refetchInterval: 1000 * 5, // 5 seconds
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || 'Failed to fetch events.'} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
