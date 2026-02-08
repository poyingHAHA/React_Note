import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchEvents } from '../../utils/http.js';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState(undefined);

  const { data, error, isError, isPending, isLoading, refetch } = useQuery({
    queryKey: ['events', {search: searchTerm}],
    queryFn: ({signal}) => fetchEvents({searchTerm, signal}),
    enabled: searchTerm !== undefined, // only fetch when searchTerm is set, otherwise it will fetch on component mount with an empty search term
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term to find events.</p>;

  // the difference between isPending and isLoading is that isPending is true during the initial fetch, while isLoading is true during any fetch, including refetches. In this case, we want to show the loading indicator during refetches as well, so we use isLoading.
  if (isLoading) {
    content = <LoadingIndicator />;
  }
  if (isError) {
    content = <ErrorBlock title="An error occurred" message={error.info?.message || 'Failed to fetch events.'} />;
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
