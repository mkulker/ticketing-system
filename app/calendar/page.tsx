"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Badge, BadgeProps, Select } from 'antd';
import { CalendarProps } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const { Option } = Select;
const supabase = createClient();

interface Event {
  id: number;
  name: string;
  start: string; // This will be a timestampz from Supabase
  description: string;
  Category: string[]; // Updated to be an array of strings
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mode, setMode] = useState<'month' | 'year'>('month');

  const categories = [
    "Concert",
    "Movie",
    "Play",
    "Athletics",
    "Conference",
    "Convention",
    "Other",
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
        setFilteredEvents(data);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => 
        Array.isArray(event.Category) && selectedCategories.every(category => event.Category.includes(category))
      ));
    }
  }, [selectedCategories, events]);

  const handleCategoryChange = (value: string[]) => {
    setSelectedCategories(value);
  };

  const getListData = (value: Dayjs) => {
    const dateString = value.format('YYYY-MM-DD');
    return filteredEvents.filter(event => dayjs(event.start).format('YYYY-MM-DD') === dateString).map(event => ({
      type: 'success',
      content: event.name,
      id: event.id,
    }));
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Link href={`/buyTickets/${item.id}`}>
              <Badge status={item.type as BadgeProps['status']} text={item.content} />
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const onPanelChange = (value: Dayjs, newMode: 'month' | 'year') => {
    setMode('month'); // Force the mode to stay in 'month'
  };

  return (
    <div>
      <Select
        mode="multiple"
        allowClear
        placeholder="Select categories"
        onChange={handleCategoryChange}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        {categories.map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>
      <Calendar mode="month" onPanelChange={onPanelChange} cellRender={dateCellRender} />
    </div>
  );
};

export default App;