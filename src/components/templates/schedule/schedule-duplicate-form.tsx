import { scheduleService } from '@/services/schedule.service';
import { Drawer, Form, Modal, DatePicker, TimeRangePickerProps, notification, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

const { RangePicker } = DatePicker;

type Props = {
  open: boolean;
  onClose: () => void;
};

const ScheduleDuplicateForm = ({ open, onClose }: Props) => {

  const [form] = useForm()

  const [startDate, setStartDate] = React.useState<Dayjs | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Dayjs | undefined>(undefined);
  const [startDateDestiny, setStartDateDestiny] = React.useState<Dayjs | undefined>(undefined);

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Últimos 7 Días', value: [dayjs().add(-7, 'd'), dayjs()] },
  ];

  const disabledDate = (current: Dayjs) => {
    // No permitir fechas posteriores a una semana desde la fecha de inicio seleccionada
    return startDate && current.isAfter(startDate!.add(6, 'days'))? true: false;
  };
  
  const disabledDateDestiny = (current: Dayjs) => {
    // No permitir fechas posteriores a una semana desde la fecha de inicio seleccionada
    return (endDate && current.isBefore(endDate.add(1, 'days'))) ||
      (startDateDestiny && current.isAfter(startDateDestiny?.add(6, 'days')))
      ? true
      : false;
  };

  const onDatesChange = (dates: any) => {
    // Actualizar la fecha de inicio cuando se selecciona una nueva fecha de inicio
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };
  
  const onDatesChangeDestiny = (dates: any) => {
    // Actualizar la fecha de inicio cuando se selecciona una nueva fecha de inicio
    setStartDateDestiny(dates[0]);
  };

  const resetDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setStartDateDestiny(undefined);
  }

  const handleOnClose = ()=> {
    form.resetFields();
    resetDates();
    onClose();
  }

  const handleOk = () => {
    Modal.confirm({
      title: '¿Está seguro que desea duplicar la programación?',
      content: (
        <div>
          <Typography.Text>
            Los programas recurrentes en la semana de destino se eliminarán
            automáticamente.
          </Typography.Text>
        </div>
      ),
      okButtonProps: {
        type: 'primary',
        danger: true,
      },
      okText: 'ACEPTAR',
      cancelText: 'CANCELAR',
      onOk() {
        form
          .validateFields()
          .then((values) => {
            scheduleService.duplicate({
              start_o: values.start[0].toISOString(),
              end_o: values.start[1].toISOString(),
              start_d: values.end[0].toISOString(),
              end_d: values.end[1].toISOString(),
            }).then((response) => {
            form.resetFields();
            onClose();
            resetDates();
            notification.success({
              message: 'Programación duplicada con éxito',
              description: 'La programación se ha duplicado con éxito',
              placement: 'topRight',
            });
          }).catch((info) => {
            notification.error({
              message: 'Error al duplicar la programación',
              description: 'Ha ocurrido un error al duplicar la programación',
              placement: 'topRight',
            });
            
          })
          .catch((info) => {
            notification.error({
              message: 'Error al duplicar la programación',
              description: 'Ha ocurrido un error al duplicar la programación',
              placement: 'topRight',
            });
          });
        })
      },
      onCancel() {},
    });
    
  };


  return (
    <Modal
      open={open}
      okText={'DUPLICAR'}
      cancelText={'CANCELAR'}
      onCancel={handleOnClose}
      title={'DUPLICAR PROGRAMACIÓN'}
      onOk={handleOk}
    >
      <Form form={form}>
        <Form.Item name={'start'} label={'Rango de origen'} rules={[
          { required: true, message: 'Por favor seleccione un rango de fechas'}
        ]}>
          <RangePicker
            onCalendarChange={onDatesChange}
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item name={'end'} label={'Rango de destino'} rules={[
          { required: true, message: 'Por favor seleccione un rango de fechas'}
        ]}>
          <RangePicker
            presets={rangePresets}
            onCalendarChange={onDatesChangeDestiny}
            disabledDate={disabledDateDestiny}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleDuplicateForm;
