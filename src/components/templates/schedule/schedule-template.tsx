'use client';
import { Button, Col, Descriptions, Drawer, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import { useEffect, useState } from 'react';
import { Calendar, Event, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import NewEditScheduleForm from './new-edit-schedule-form';
import NewEditProgramasForm from '../programas/new-edit-programas-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSchedules } from '@/store/slices/dashboard/schedule/scheduleSlice';
import { useRouter } from 'next/navigation';
import ScheduleDuplicateForm from './schedule-duplicate-form';
import {
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import DeleteScheduleModal from './delete-schedule-modal';
import { IScheduleResponse } from '@/interfaces/schedule.interface';

const localizer = momentLocalizer(moment);

const ScheduleTemplate = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schedules = useAppSelector((state) => state.schedule.schedules);
  const loading = useAppSelector((state) => state.schedule.loading);
  const [open, setOpen] = useState(false);
  const [openProgram, setOpenProgram] = useState(false);
  const [openDuplication, setOpenDuplication] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  let modal: any;

  const dayRangeHeaderFormat = (
    { start, end }: { start: Date; end: Date },
    culture: any,
    local: any
  ) =>
    local.format(start, 'MMMM DD', culture) +
    ' - ' +
    // updated to use this localizer 'eq()' method
    local.format(
      end,
      local.eq(start, end, 'month') ? 'DD YYYY' : 'MMMM DD YYYY',
      culture
    );

  const hadleFetch = async (params: any) => {
    dispatch(fetchSchedules(params));
  };

  useEffect(() => {
    hadleFetch(undefined);
  }, []);

  useEffect(() => {
    setEvents(
      schedules.map((schedule: IScheduleResponse) => {
        return {
          id: schedule.id,
          title: schedule.attributes.title,
          start: new Date(schedule.attributes.start),
          end: new Date(schedule.attributes.end),
          resource: schedule,
        };
      })
    );
  }, [schedules]);

  const handleEdit = () => {
    if (selectedEvent) {
      setOpen(true);
      setDrawerVisible(false)
    }
  };
  return (
    <div style={{ width: '100%' }}>
      <Row justify='end'>
        <Button
          type='primary'
          style={{ marginBottom: '20px' }}
          onClick={() => setOpen(true)}
          icon={<PlusOutlined />}
        >
          AGREGAR PROGRAMACIÓN
        </Button>
        <Button
          type='primary'
          style={{ marginBottom: '20px', marginLeft: '5px' }}
          onClick={() => setOpenDuplication(true)}
          icon={<CopyOutlined />}
        >
          DUPLICAR PROGRAMACIÓN
        </Button>
        <Button
          type='primary'
          style={{ marginBottom: '20px', marginLeft: '5px' }}
          onClick={() => setOpenProgram(true)}
          icon={<PlusOutlined />}
        >
          AGREGAR PROGRAMA
        </Button>
        <Button
          type='primary'
          danger
          style={{ marginBottom: '20px', marginLeft: '5px' }}
          onClick={() => setOpenDelete(true)}
          icon={<DeleteOutlined />}
        >
          ELIMINAR PROGRAMACIONES
        </Button>
      </Row>
      {!loading ? (
        <Calendar
          formats={{ dayRangeHeaderFormat }}
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          defaultView='week'
          views={['week', 'day']}
          messages={{
            today: 'Hoy',
            next: 'Siguiente',
            previous: 'Anterior',
            week: 'Semana',
            day: 'Día',
          }}
          timeslots={1}
          onDoubleClickEvent={(event) => {
            setSelectedEvent(event);
            setDrawerVisible(true);
          }}
          // components={components}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin size='large' />
        </div>
      )}
      <NewEditScheduleForm
        currentSchedule={selectedEvent?.resource}
        open={open}
        onClose={() => {
          setOpen(false)
          hadleFetch(undefined);
        }}
      />
      <NewEditProgramasForm
        open={openProgram}
        onClose={() => setOpenProgram(false)}
      />
      <ScheduleDuplicateForm
        open={openDuplication}
        onClose={() => {
          hadleFetch(undefined);
          setOpenDuplication(false);
        }}
      />
      <DeleteScheduleModal open={openDelete} setOpen={(value)=> {
        hadleFetch(undefined);
        setOpenDelete(value)}} />
      <Drawer
        width={'60%'}
        title={
          <div>
            Detalles del evento
            <EditOutlined style={{ marginLeft: '10px' }} onClick={handleEdit} />
          </div>
        }
        open={drawerVisible}
        onClose={() => {
          setSelectedEvent(null);
          setDrawerVisible(false);
          hadleFetch(undefined);
        }}
      >
        {selectedEvent && (
          <Descriptions layout='horizontal' title='Información del evento'>
            {Object.entries(selectedEvent.resource.attributes)
              .filter(
                ([key]) =>
                  ![
                    'publishedAt',
                    'createdAt',
                    'updatedAt',
                    'nomencladors',
                  ].includes(key)
              )
              .map(([key, value]) => {
                let displayValue = value;
                if (
                  ['start', 'end'].includes(key) &&
                  typeof value === 'string'
                ) {
                  displayValue = new Date(value).toLocaleString();
                } else if (key === 'duration' && typeof value === 'string') {
                  const duration = Number(value);
                  const hours = Math.floor(duration / 3600000);
                  const minutes = Math.floor(
                    (duration - hours * 3600000) / 60000
                  );
                  const seconds = Math.floor(
                    (duration - hours * 3600000 - minutes * 60000) / 1000
                  );
                  displayValue = `${hours}h ${minutes}m ${seconds}s`;
                } else if (key === 'channel') {
                  displayValue =
                    value && (value as any).data ? (value as any).data : '-';
                }
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <Descriptions.Item label={label} key={key}>
                    {displayValue ? displayValue.toString() : '-'}
                  </Descriptions.Item>
                );
              })}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default ScheduleTemplate;
