"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Badge, BadgeProps } from 'antd';
import { CalendarProps } from 'antd';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const supabase = createClient();

interface Event {
  id: number;
  name: string;
  start: string; // This will be a timestampz from Supabase
  description: string;
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  const getListData = (value: Dayjs) => {
    const dateString = value.format('YYYY-MM-DD');
    return events.filter(event => dayjs(event.start).format('YYYY-MM-DD') === dateString).map(event => ({
      type: 'success',
      content: event.name,
      id: event.id,
    }));
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Link href={`/buyTickets/${item.id}`}><Badge status={item.type as BadgeProps['status']} text={item.content} /></Link>
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};

export default App;