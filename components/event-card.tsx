import React from 'react';

interface EventCardProps {
    title: string;
    date: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, location, description,startDate,endDate }) => {
    return (
        <div className="event-card">
            <p><strong>Name:</strong> {title}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>From:</strong> {startDate}</p>
            <p><strong>To:</strong> {endDate}</p>
        </div>
    );
};

export default EventCard;