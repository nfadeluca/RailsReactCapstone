import React, { useState, useEffect } from 'react';
import Header from './Header';
import EventList from './EventList';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Event from './Event';
import './App.css';
import EventForm from './EventForm';
import { handleAjaxError } from '../helpers/helpers';


const Editor = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await window.fetch('/api/events');
                if (!response.ok) throw Error(response.statusText);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                handleAjaxError(error);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    const addEvent = async (newEvent) => {
        try {
            const response = await window.fetch('/api/events', {
                method: 'POST',
                body: JSON.stringify(newEvent),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw Error(response.statusText);
            const savedEvent = await response.json();
            const newEvents = [...events, savedEvent];
            setEvents(newEvents);
            success('Event Added!');
            navigate(`/events/${savedEvent.id}`);
        } catch (error) {
            handleAjaxError(error);
        }
    };

    const deleteEvent = async (eventId) => {
        const sure = window.confirm('Are you sure?');
        if (sure) {
            try {
                const response = await window.fetch(`/api/events/${eventId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw Error(response.statusText);
                success('Event Deleted!');
                navigate('/events');
                setEvents(events.filter(event => event.id !== eventId));
            } catch (error) {
                handleAjaxError(error);
            }
        }
    };

    const updateEvent = async (updatedEvent) => {
        try {
            const response = await window.fetch(
                `/api/events/${updatedEvent.id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(updatedEvent),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) throw Error(response.statusText);

            const newEvents = events;
            const idx = newEvents.findIndex((event) => event.id === updatedEvent.id);
            newEvents[idx] = updatedEvent;
            setEvents(newEvents);

            success('Event Updated!');
            navigate(`/events/${updatedEvent.id}`);
        } catch (error) {
            handleAjaxError(error);
        }
    };


    return (
        <>
            <Header />
            <div className="grid">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <EventList events={events} />

                        <Routes>
                            <Route
                                path=":id"
                                element={<Event events={events} onDelete={deleteEvent} />}
                            />
                            <Route
                                path=":id/edit"
                                element={<EventForm events={events} onSave={updateEvent} />}
                            />
                            <Route path="new" element={<EventForm onSave={addEvent} />} />
                        </Routes>


                    </>
                )}
            </div>
        </>
    );

};

export default Editor;
