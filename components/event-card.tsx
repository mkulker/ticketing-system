import React from 'react';
import Link from "next/link";
interface EventCardProps {
    title: string;
    date: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
    event_id: number;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, location, description,startDate,endDate,event_id }) => {
    return (
        <Link href={`/buyTickets/${event_id}`}>
        <div className="event-card">
            <p><strong>Name:</strong> {title}</p>
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>From:</strong> {startDate}</p>
            <p><strong>To:</strong> {endDate}</p>
        </div>
        </Link>
    );
};

export default EventCard;