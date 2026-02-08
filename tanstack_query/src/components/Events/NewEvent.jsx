import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createNewEvent, queryClient } from '../../utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      // invalidate the 'events' query to refetch the events list and show the newly created event
      // we use exact: true to only invalidate the query with the exact key ['events'], otherwise it would also invalidate queries like ['events', {search: 'something'}], which would cause unnecessary refetches if we have a search feature
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    }
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {
          isPending && <p>'Submitting...'</p>
        }
        {
          !isPending &&
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        }
      </EventForm>
      {
        isError && <ErrorBlock title={"Failed to create event"} message={error.info?.message || 'Failed to create event.'} />
      }
    </Modal>
  );
}
