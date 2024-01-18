/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { INomenclatorResponse } from '@/interfaces/nomenclador.interface';
import { IProgramResponse } from "@/interfaces/program.interface";
import { channelsService } from '@/services/channel.services';
import { programService } from "@/services/programs.service";
import { NomenclatorEnum } from '@/types/nomencladores';
import { SelectOption } from '@/types/select.type';
import { convertToSeconds } from "@/utils/timeUtils";
import { SaveFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import useNomenclators from "./nomenclators.hook";

const { TimePicker } = DatePicker;

type FormProps = {
  open: boolean;
  onClose: () => void;
  currentProgram?: IProgramResponse;
};

const NewEditProgramasForm = ({ open, onClose, currentProgram }: FormProps) => {
  const isEditMode = !!currentProgram;

  const [channels, setChannels] = useState<SelectOption[]>([]);

  const nomenclators = useNomenclators();

  const [form] = useForm();

  const handleFinish = async (values: any) => {
    values.duration = convertToSeconds(values.duration.format('HH:mm:ss'));
    values.active = true;
    values.approved = true;
    values.nomencladors = Object.keys(NomenclatorEnum).map(key=> form.getFieldValue(key))
    Object.keys(NomenclatorEnum).forEach(key => {
      delete values[key]
    })
    
    if (isEditMode) {
      programService
        .put(currentProgram.id, values)
        .then(() => {
          notification.success({
            message: 'Programa actualizado con éxito',
          });
          form.resetFields();
          onClose();
        })
        .catch(({ response }) => {
          notification.error({
            message:
              response.data.error.message || 'Error al actualizar el programa',
          });
        });
    } else {
      programService
        .post(values)
        .then(() => {
          notification.success({ message: 'Programa creado con éxito' });
          form.resetFields();
          onClose();
        })
        .catch(({ response }) => {
          notification.error({
            message:
              response.data.error.message || 'Error al crear el programa',
          });
        });
    }
  };

  const getValue = (list: INomenclatorResponse[], value: NomenclatorEnum) => {
    return list.find((item) => item.attributes.type === value)?.id;
  }; 

  const updateEnumValues = () => {
    Object.keys(NomenclatorEnum).forEach(key => {
      form.setFieldsValue({
        [key]: getValue(currentProgram?.attributes.nomencladors.data!, key as NomenclatorEnum)
      })
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      duration: currentProgram
        ? dayjs(+currentProgram?.attributes.duration!)
        : dayjs().set('hour', 0).set('minute', 0).set('second', 0),
      title: currentProgram?.attributes.title || '',
      description: currentProgram?.attributes.description || '',
      thumbnail: currentProgram?.attributes.thumbnail || '',
      keywords: currentProgram?.attributes.keywords || '',
      active: currentProgram?.attributes.active || true,
      approved: currentProgram?.attributes.approved || true,
      titleInternal: currentProgram?.attributes.titleInternal || '',
      programId: currentProgram?.attributes.programId || '',
      videoPublishDate:
        currentProgram ?dayjs(currentProgram?.attributes.videoPublishDate) :
        dayjs().set('hour', 0).set('minute', 0).set('second', 0),
      channel_id: currentProgram?.attributes.channel_id.data?.id || '',
    });
    currentProgram && updateEnumValues()
  }, [currentProgram]);

  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const fetchChannels = async () => {
    const { data: channelData } = await channelsService.get({
    populate: {},
    fields: {
      0: 'name',
    },
    _limit: -1
  });
  setChannels(channelData.data.map((channel: any) => ({ label: channel.attributes.name, value: channel.id })));
}

useEffect(() => {
  fetchChannels()
}, [])


const formInitialValues = () => {
  return !currentProgram
    ? {
        [NomenclatorEnum.channelprovider]:
          nomenclators?.channelprovider[0].value,
        [NomenclatorEnum.contentformat]: nomenclators?.contentformat[0].value,
        [NomenclatorEnum.contenttype]: nomenclators?.contenttype[0].value,
        [NomenclatorEnum.country]: nomenclators?.country[0].value,
        [NomenclatorEnum.genre]: nomenclators?.genre[0].value,
        [NomenclatorEnum.language]: nomenclators?.language[0].value,
        [NomenclatorEnum.parentalrating]: nomenclators?.parentalrating[0].value,
        [NomenclatorEnum.programtype]: nomenclators?.programtype[0].value,
        [NomenclatorEnum.series]: nomenclators?.series[0].value,
        [NomenclatorEnum.subgenre]: nomenclators?.subgenre[0].value,
        [NomenclatorEnum.videoid]: nomenclators?.videoid[0].value,
        [NomenclatorEnum.externalmetadataId]:
          nomenclators?.externalmetadataId[0].value,
        [NomenclatorEnum.outputype]: nomenclators?.outputype[0].value,
        [NomenclatorEnum.channelstatus]: nomenclators?.channelstatus[0].value,
        channel_id: channels[0]?.value,
      }
    : undefined;
}


  return (
    <Drawer
      open={open}
      onClose={handleClose}
      size='large'
      title={isEditMode ? 'EDITAR PROGRAMA' : 'AGREGAR PROGRAMA'}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 12,
        }}
        scrollToFirstError
        initialValues={formInitialValues()}
      >
        <Card
          actions={[
            <Button
              key='actBtnPrgrm'
              type='primary'
              htmlType='submit'
              size='large'
              // loading={loading}
              // disabled={loading}
            >
              <SaveFilled style={{ fontSize: 25 }} />
              <span style={{ fontSize: 18 }}>Guardar</span>
            </Button>,
          ]}
        >
          <Form.Item
            label='Código'
            name='programId'
            rules={[
              {
                required: true,
                message: 'Ingrese el código del programa',
              },
            ]}
          >
            <Input placeholder='Código' />
          </Form.Item>
          <Form.Item
            label='Título'
            name='title'
            rules={[
              {
                required: true,
                message: 'Ingrese el título del programa',
              },
            ]}
          >
            <Input placeholder='Título' />
          </Form.Item>
          <Form.Item
            label='Título interno'
            name='titleInternal'
            rules={[
              {
                required: true,
                message: 'Ingrese el nombre del título interno del programa',
              },
            ]}
          >
            <Input placeholder='Título interno' />
          </Form.Item>
          <Form.Item
            label='Descripción'
            name='description'
            rules={[
              {
                required: true,
                message: 'Ingrese la descripción del programa',
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 5 }}
              placeholder='Descripción'
            />
          </Form.Item>
          <Form.Item
            label='Fecha de Publicación'
            name='videoPublishDate'
            rules={[
              {
                required: true,
                message: 'Ingrese la fecha de publicación del programa',
              },
            ]}
          >
            <DatePicker placeholder='Fecha de Publicación' />
          </Form.Item>
          <Form.Item
            label='Duración'
            name='duration'
            rules={[
              {
                required: true,
                message: 'Ingrese la duración del programa',
              },
            ]}
          >
            <TimePicker placeholder='Duración' />
          </Form.Item>
          <Form.Item
            label='Tipo de programa'
            name={NomenclatorEnum.programtype}
            rules={[
              {
                required: true,
                message: 'Seleccione el tipo de programa',
              },
            ]}
          >
            <Select
              options={nomenclators?.programtype}
              placeholder='Tipo de programa'
            />
          </Form.Item>
          <Form.Item
            label='Id de Video'
            name={NomenclatorEnum.videoid}
            rules={[
              {
                required: true,
                message: 'Seleccione el id de video',
              },
            ]}
          >
            <Select
              options={nomenclators?.videoid}
              placeholder='Id de Video'
            />
          </Form.Item>
          <Form.Item
            label='Id de Video Partner'
            name='video_id_partner_id'
            rules={[
              {
                required: true,
                message: 'Seleccione el id de video partner',
              },
            ]}
          >
            <Select
              options={nomenclators?.videoid}
              placeholder='Id de Video Partner'
            />
          </Form.Item>
          <Form.Item
            label='Género'
            name={NomenclatorEnum.genre}
            rules={[
              {
                required: true,
                message: 'Seleccione el género',
              },
            ]}
          >
            <Select
              options={nomenclators?.genre}
              placeholder='Géneros'
            />
          </Form.Item>
          <Form.Item
            label='SubGénero'
            name={NomenclatorEnum.subgenre}
            rules={[
              {
                required: true,
                message: 'Seleccione el subgénero',
              },
            ]}
          >
            <Select
              options={nomenclators?.subgenre}
              placeholder='SubGéneros'
            />
          </Form.Item>
          <Form.Item
            label='Serie'
            name={NomenclatorEnum.series}
            rules={[
              {
                required: true,
                message: 'Seleccione la serie',
              },
            ]}
          >
            <Select
              options={nomenclators?.series}
              placeholder='Series'
            />
          </Form.Item>
          <Form.Item label='Palabras claves' name='keywords'>
            <Input placeholder='adultos, accion...' />
          </Form.Item>
          <Form.Item
            label='Control parental'
            name={NomenclatorEnum.parentalrating}
            rules={[
              {
                required: true,
                message: 'Seleccione el tipo control parental',
              },
            ]}
          >
            <Select
              options={nomenclators?.parentalrating}
              placeholder='Tipo de Control parental'
            />
          </Form.Item>
          <Form.Item
            label='País'
            name={NomenclatorEnum.country}
            rules={[
              {
                required: true,
                message: 'Seleccione el País',
              },
            ]}
          >
            <Select
              options={nomenclators?.country}
              placeholder='Países'
            />
          </Form.Item>
          <Form.Item
            label='Idioma'
            name={NomenclatorEnum.language}
            rules={[
              {
                required: true,
                message: 'Seleccione el Idioma',
              },
            ]}
          >
            <Select options={nomenclators?.language} placeholder='Idioma' />
          </Form.Item>
          <Form.Item
            label='Formato'
            name={NomenclatorEnum.contentformat}
            rules={[
              {
                required: true,
                message: 'Seleccione el Formato',
              },
            ]}
          >
            <Select
              options={nomenclators?.contentformat}
              placeholder='Formato'
            />
          </Form.Item>
          <Form.Item
            label='Formato'
            name={NomenclatorEnum.contenttype}
            rules={[
              {
                required: true,
                message: 'Seleccione el Tipo de formato',
              },
            ]}
          >
            <Select options={nomenclators?.contenttype} placeholder='Tipo' />
          </Form.Item>
          <Form.Item
            label='Canal'
            name='channel_id'
            rules={[
              {
                required: true,
                message: 'Seleccione el Canal',
              },
            ]}
          >
            <Select options={channels} placeholder='Canal' />
          </Form.Item>
          <Form.Item
            label='Thumbnail URL'
            name='thumbnail'
            rules={[
              {
                required: true,
                message: 'Ingrese la url del thumbnail',
              },
            ]}
          >
            <Input placeholder='Thumbnail URL' />
          </Form.Item>
        </Card>
      </Form>
    </Drawer>
  );
};

export default NewEditProgramasForm;
