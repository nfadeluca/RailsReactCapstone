import React, { useState, useRef, useEffect } from 'react';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import { formatDate, isEmptyObject, validateEvent } from '../helpers/helpers';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import EventNotFound from './EventNotFound';

const EventForm = ({ events, onSave }) => {
    const { id } = useParams();

    const defaults = {
        event_type: '',
        event_date: '',
        title: '',
        speaker: '',
        host: '',
        published: false,
    }

    const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
    const initialEventState = { ...defaults, ...currEvent }
    const [event, setEvent] = useState(initialEventState);

    const [formErrors, setFormErrors] = useState({});

    const dateInput = useRef(null);

    const updateEvent = (key, value) => {
        setEvent((prevEvent) => ({ ...prevEvent, [key]: value }));
    };

    useEffect(() => {
        const p = new Pikaday({
            field: dateInput.current,
            toString: date => formatDate(date),
            onSelect: (date) => {
                const formattedDate = formatDate(date);
                dateInput.current.value = formattedDate;
                updateEvent('event_date', formattedDate);
            },
        });

        // Return a cleanup function.
        // React will call this prior to unmounting.
        return () => p.destroy();
    }, []);


    const handleInputChange = (e) => {
        const { target } = e;
        const { name } = target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        updateEvent(name, value);
    };

    const validateEvent = () => {
        const errors = {};

        if (event.event_type === '') {
            errors.event_type = 'You must enter an event type';
        }

        if (event.event_date === '') {
            errors.event_date = 'You must enter a valid date';
        }

        if (event.title === '') {
            errors.title = 'You must enter a title';
        }

        if (event.speaker === '') {
            errors.speaker = 'You must enter at least one speaker';
        }

        if (event.host === '') {
            errors.host = 'You must enter at least one host';
        }

        return errors;
    };

    const isEmptyObject = (obj) => Object.keys(obj).length === 0;

    const renderErrors = () => {
        if (isEmptyObject(formErrors)) {
            return null;
        }

        return (
            <div className="errors">
                <h3>The following errors prohibited the event from being saved:</h3>
                <ul>
                    {Object.values(formErrors).map((formError) => (
                        <li key={formError}>{formError}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateEvent(event);

        if (!isEmptyObject(errors)) {
            setFormErrors(errors);
        } else {
            onSave(event);
        }
    };

    const cancelURL = event.id ? `/events/${event.id}` : '/events';
    const title = event.id ? `${event.event_date} - ${event.event_type}` : 'New Event';

    if (id && !event.id) return <EventNotFound />;

    return (
        <div>
            <h2>{title}</h2>
            {renderErrors()}
            <form className="eventForm" onSubmit={handleSubmit}>
                ...
                <div className="form-actions">
                    <button type="submit">Save</button>
                    <Link to={cancelURL}>Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default EventForm;

EventForm.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            event_type: PropTypes.string.isRequired,
            event_date: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            speaker: PropTypes.string.isRequired,
            host: PropTypes.string.isRequired,
            published: PropTypes.bool.isRequired,
        })
    ),
    onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
    events: [],
};