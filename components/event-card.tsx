import React from 'react';

interface EventCardProps {
    title: string;
    date: string;
    location: string;
    description: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, location, description }) => {
    return (
        <div className="event-card">
            <h2>{title}</h2>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Location:</strong> {location}</p>
            <p>{description}</p>
        </div>
    );
};

export default EventCard;