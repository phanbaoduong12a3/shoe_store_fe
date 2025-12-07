import React, { useState, useRef, useEffect } from 'react';
import { Button, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export interface DateRangeFilterProps {
  value: [Dayjs | null, Dayjs | null];
  onChange: (val: [Dayjs | null, Dayjs | null]) => void;
}

const presets = {
  today: [dayjs(), dayjs()] as [Dayjs, Dayjs],
  week: [dayjs().subtract(6, 'day'), dayjs()] as [Dayjs, Dayjs],
  month: [dayjs().startOf('month'), dayjs()] as [Dayjs, Dayjs],
};

const getDays = (month: Dayjs) => {
  const start = month.startOf('month').startOf('week');
  const end = month.endOf('month').endOf('week');
  const days: Dayjs[] = [];

  let curr = start;
  while (curr.isBefore(end)) {
    days.push(curr);
    curr = curr.add(1, 'day');
  }

  return days;
};

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange }) => {
  const [start, end] = value;
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [monthStart, setMonthStart] = useState(dayjs());
  const [monthEnd, setMonthEnd] = useState(dayjs());

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenStart(false);
        setOpenEnd(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handlePick = (type: 'start' | 'end', d: Dayjs) => {
    if (type === 'start') onChange([d, end]);
    if (type === 'end') onChange([start, d]);
  };
  const [active, setActive] = useState<string>('');
  const handlePreset = (key: string) => {
    setActive(key);
    onChange(presets[key as keyof typeof presets]);
  };

  return (
    <Space wrap ref={ref}>
      <div style={{ position: 'relative' }}>
        <input
          readOnly
          onClick={() => {
            setOpenStart((p) => !p);
            setOpenEnd(false);
          }}
          value={start ? start.format('DD/MM/YYYY') : ''}
          placeholder="Từ ngày"
          style={{
            padding: '6px 10px',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            width: 120,
            cursor: 'pointer',
          }}
        />

        {openStart && (
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              border: '1px solid #ddd',
              background: 'white',
              padding: 8,
              borderRadius: 6,
              zIndex: 1000,
              width: 240,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Button size="small" onClick={() => setMonthStart(monthStart.subtract(1, 'month'))}>
                {'<'}
              </Button>
              <strong>{monthStart.format('MM/YYYY')}</strong>
              <Button size="small" onClick={() => setMonthStart(monthStart.add(1, 'month'))}>
                {'>'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {getDays(monthStart).map((d) => {
                const active = start?.isSame(d, 'day');
                return (
                  <div
                    key={d.toString()}
                    onClick={() => handlePick('start', d)}
                    style={{
                      padding: '4px 0',
                      textAlign: 'center',
                      borderRadius: 4,
                      background: active ? '#1677ff' : 'transparent',
                      color: active ? '#fff' : '#000',
                      cursor: 'pointer',
                    }}
                  >
                    {d.date()}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <input
          readOnly
          onClick={() => {
            setOpenEnd((p) => !p);
            setOpenStart(false);
          }}
          value={end ? end.format('DD/MM/YYYY') : ''}
          placeholder="Đến ngày"
          style={{
            padding: '6px 10px',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            width: 120,
            cursor: 'pointer',
          }}
        />

        {openEnd && (
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              border: '1px solid #ddd',
              background: 'white',
              padding: 8,
              borderRadius: 6,
              zIndex: 1000,
              width: 240,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Button size="small" onClick={() => setMonthEnd(monthEnd.subtract(1, 'month'))}>
                {'<'}
              </Button>
              <strong>{monthEnd.format('MM/YYYY')}</strong>
              <Button size="small" onClick={() => setMonthEnd(monthEnd.add(1, 'month'))}>
                {'>'}
              </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {getDays(monthEnd).map((d) => {
                const active = end?.isSame(d, 'day');
                return (
                  <div
                    key={d.toString()}
                    onClick={() => handlePick('end', d)}
                    style={{
                      padding: '4px 0',
                      textAlign: 'center',
                      borderRadius: 4,
                      background: active ? '#1677ff' : 'transparent',
                      color: active ? '#fff' : '#000',
                      cursor: 'pointer',
                    }}
                  >
                    {d.date()}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Button
        type={active === 'today' ? 'primary' : 'default'}
        onClick={() => handlePreset('today')}
      >
        Hôm nay
      </Button>
      <Button type={active === 'week' ? 'primary' : 'default'} onClick={() => handlePreset('week')}>
        7 ngày qua
      </Button>
      <Button
        type={active === 'month' ? 'primary' : 'default'}
        onClick={() => handlePreset('month')}
      >
        Tháng này
      </Button>
    </Space>
  );
};

export default DateRangeFilter;
