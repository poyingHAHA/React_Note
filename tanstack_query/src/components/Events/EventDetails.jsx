import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';

import Header from '../Header.jsx';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchEvent, deleteEvent, queryClient } from '../../utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';
import { useState } from 'react';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);

  // we use useParams to get the event id from the url, and then use that id to fetch the event details. We also include the event id in the query key, so that when we navigate to the edit page, which uses a different query key, it won't trigger a refetch of the event details.
  const params = useParams();
  const navigate = useNavigate();
  const {data, isPending, isError, error} = useQuery({
    // since we don't want to refetch the event details when we navigate to the edit page, we use a query key that includes the event id, 
    // so that the edit page can use a different query key and won't trigger a refetch of the event details when it mounts
    queryKey: ['event', params.id],
    queryFn: ({signal}) => fetchEvent({id: params.id, signal}),
  });

  const {mutate, isPending: isPendingDeletion, isError: isErrorDeletion, error: errorDeletion} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      // after deleting the event, we want to invalidate the 'events' query to refetch the events list and remove the deleted event from the list. We also navigate back to the events list page.
      queryClient.invalidateQueries({
        queryKey: ['events'],
        // this only invalidates the query with key ['events'], but it won't refetch immediately. 
        // The refetch will happen the next time the 'events' query is used, which is when we navigate back to the events list page.
        // This way we avoid an unnecessary refetch which the event details query of current page will not trigger again since it was deleted.
        refetchType: 'none'
      });
      navigate('/events');
    }
  });

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleCancelDelete() {
    setIsDeleting(false);
  }

  function handleDelete() {
    mutate({
      id: params.id,
    });
  }

  let content;

  if (isPending) {
    content = <div id="event-details-content" className='center'>
      <p>Fetching event details...</p>
    </div>
  }

  if (isError) {
    content = <div id="event-details-content" className='center'>
      <ErrorBlock title="Failed to fetch event details" message={error.info?.message || "Failed to load event details"} />
    </div>
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {data.time}</time>
            </div>
            <p id="event-details-description" >{data.description}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {isDeleting && <Modal onClose={handleCancelDelete}>
        <h2>Are you sure you want to delete this event?</h2>
        <p>This action cannot be undone.</p>
        <div className="form-actions">
          {
            isPendingDeletion && <p>Deleting...</p>
          }
          {
            !isPendingDeletion && (
              <>
                <button onClick={handleCancelDelete} className='button-text' >Cancel</button>
                <button onClick={handleDelete} className='button'>Delete</button>
              </>
            )
          }
        </div>
        {
          isErrorDeletion && <ErrorBlock title="Failed to delete event" message={errorDeletion.info?.message || 'Failed to delete event.'} />
        }
      </Modal>}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
