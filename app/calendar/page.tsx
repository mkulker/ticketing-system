"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Badge, BadgeProps, Select, DatePicker, Slider } from 'antd';
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
  category: string[]; // Updated to be an array of strings
  latitude: number;
  longitude: number;
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number>(10); // Default distance in kilometers

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
      if (!userLocation) return;

      const { data, error } = await supabase.rpc('get_nearby_events', {
        user_lat: userLocation.latitude,
        user_lon: userLocation.longitude,
        radius_km: distance,
      });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
        filterEvents(data, selectedCategories);
      }
    };

    fetchEvents();
  }, [userLocation, distance]);

  useEffect(() => {
    filterEvents(events, selectedCategories);
  }, [selectedCategories, events]);

  const filterEvents = (events: Event[], categories: string[]) => {
    if (categories.length === 0) {
      setFilteredEvents(events);
    } else {


      const filtered = events.filter(event => {
        return Array.isArray(event.category) && event.category && categories.some(category => event.category.includes(category));
      });

      setFilteredEvents(filtered);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleCategoryChange = (value: string[]) => {
    setSelectedCategories(value);
  };

  const handleDateChange = (date: Dayjs) => {
    setCurrentDate(date);
  };

  const handleDistanceChange = (value: number) => {
    setDistance(value);
  };

  const handleDistanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setDistance(0); // Set to 0 or any default value when input is empty
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue)) {
        setDistance(parsedValue);
      }
    }
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

  const headerRender = ({ value, type, onChange, onTypeChange }: { value: Dayjs; type: string; onChange: (value: Dayjs) => void; onTypeChange: (type: 'month' | 'year') => void }) => {
    return (
      <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <DatePicker
          picker="month"
          value={currentDate}
          onChange={(date) => {
            handleDateChange(date);
            onChange(date);
          }}
          style={{ marginRight: 16 }}
        />
        <Select
          mode="multiple"
          allowClear
          placeholder="Select categories"
          onChange={handleCategoryChange}
          style={{ width: '200px', marginRight: 16 }}
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
          <label style={{ marginRight: 8 }}>Distance (km):</label>
          <input
            type="number"
            value={distance}
            onChange={handleDistanceInputChange}
            style={{ 
              width: '60px', 
              marginRight: 8, 
              borderRadius: '4px', 
              border: '1px solid #d9d9d9', 
              padding: '2px', 
              backgroundColor: 'white' // Set background color to white
            }}
          />
          <Slider
            min={1}
            max={100}
            value={distance}
            onChange={handleDistanceChange}
            style={{ width: '200px' }}
          />  
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f0f0f0', color: '#333' }}>
        <Calendar
          mode="month"
          cellRender={dateCellRender}
          headerRender={headerRender}
          style={{ backgroundColor: '#f0f0f0', color: '#333' }}
        />
      </div>
    </div>
  );
};

export default App;