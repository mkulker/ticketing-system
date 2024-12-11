import React from 'react';
import Link from "next/link";


//Event card component that displays the event details on the home page

interface EventCardProps {
    title: string;
    date: string;
    location: string;
    description: string;
    startDate: string;
    endDate: string;
    event_id: number;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, location, description, startDate, endDate, event_id }) => {
    // Function to format the date
    const formatDate = (dateString: string, includeFullDate: boolean = true) => {
        const options: Intl.DateTimeFormatOptions = includeFullDate
            ? { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            : { hour: 'numeric', minute: 'numeric' };
        const date = new Date(dateString);
        return includeFullDate ? date.toLocaleDateString(undefined, options) : date.toLocaleTimeString(undefined, options);
    };

    // Split the location string by commas and remove the last 
    

    return (
        <Link href={`/buyTickets/${event_id}`}>
            <div className="event-card border p-4 rounded-md shadow-md">
                <p><strong>Name:</strong> {title}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>From:</strong> {formatDate(startDate)}</p>
                <p><strong>To:</strong> {formatDate(endDate, false)}</p>
            </div>
        </Link>
    );
};

export default EventCard;