/* eslint-disable react-hooks/exhaustive-deps */
import { INomenclatorResponse } from "@/interfaces/nomenclador.interface";
import { IProgramResponse } from "@/interfaces/program.interface";
import { IScheduleResponse } from "@/interfaces/schedule.interface";
import { programService } from "@/services/programs.service";
import { scheduleService } from "@/services/schedule.service";
import { NomenclatorEnum } from "@/types/nomencladores";
import { filterOption } from "@/utils/filter-search";
import { convertToSeconds } from "@/utils/timeUtils";
import { SaveFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  TabPaneProps,
  TimePicker,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect } from "react";

type FormProps = {
  open: boolean;
  onClose: () => void;
  currentSchedule?: IScheduleResponse;
  currentProgram?: IProgramResponse;
};

const NewEditScheduleForm = ({ open, onClose, currentSchedule }: FormProps) => {
  const isEditMode = !!currentSchedule;
  const [programs, setPrograms] = React.useState<IProgramResponse[]>([]);
  const [form] = useForm();
  const [selectedProgram, setSelectedProgram] = React.useState<
    IProgramResponse | undefined
  >(undefined);
  const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(null);
  const [startHour, setStartHour] = React.useState<number | null>(null);
  const [endHour, setEndHour] = React.useState<number | null>(null);

  const [recurrent, setRecurrent] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<Dayjs | undefined>(
    undefined
  );
  const [endDate, setEndDate] = React.useState<Dayjs | undefined>(undefined);

  const getValueName = (
    list: INomenclatorResponse[],
    value: NomenclatorEnum
  ) => {
    return list.find((item) => item.attributes.type === value)?.attributes.name;
  };
  const updateEnumValues = () => {
    Object.keys(NomenclatorEnum).forEach((key) => {
      form.setFieldsValue({
        [key]: getValueName(
          selectedProgram?.attributes.nomencladors.data!,
          key as NomenclatorEnum
        ),
      });
    });
  };

  const disabledStartDate = (current: Dayjs) => {
    // No permitir fechas que sean más de 24 horas después de la fecha de fin
    return endDate ? current.isBefore(endDate.subtract(24, "hours")) : false;
  };

  const disabledEndDate = (current: Dayjs) => {
    // No permitir fechas que sean menos de 24 horas después de la fecha de inicio
    return startDate ? current.isBefore(startDate) : false;
  };

  const disabledStartTimes = () => {
    if (!endDate) return {};

    let hours: number[] = [];
    let minutes: number[] = [];
    let currentHour = endDate.hour();
    let currentMinute = endDate.minute();

    // Si el día de inicio es el mismo que el día de fin, deshabilitar las horas y minutos que sobrepasen el límite
    if (startDate && startDate.isSame(endDate, "day")) {
      for (let i = 0; i <= currentHour; i++) hours.push(i);
      if (currentHour === startDate.hour()) {
        for (let i = 0; i <= currentMinute; i++) minutes.push(i);
      }
    }

    return {
      disabledHours: () => hours,
      disabledMinutes: () => minutes,
    };
  };

  const disabledEndTimes = () => {
    if (!startDate) return {};

    let hours: number[] = [];
    let minutes: number[] = [];
    let currentHour = startDate.hour();
    let currentMinute = startDate.minute();

    // Si el día de fin es el mismo que el día de inicio, deshabilitar las horas y minutos que sean menores al límite
    if (endDate && endDate.isSame(startDate, "day")) {
      for (let i = currentHour + 1; i < 24; i++) hours.push(i);
      if (currentHour === endDate.hour()) {
        for (let i = currentMinute + 1; i < 60; i++) minutes.push(i);
      }
    }

    return {
      disabledHours: () => hours,
      disabledMinutes: () => minutes,
    };
  };
  const onStartDateChange = (value: any) => {
    setStartDate(value);
    if (value) {
      setStartHour(value.hour());
    } else {
      setStartHour(null);
    }
  };

  const onEndDateChange = (value: any) => {
    setEndDate(value);
    if (value) {
      setEndHour(value.hour());
    } else {
      setEndHour(null);
    }
  };

  const handleProgramChange = (value: number) => {
    programService
      .getById(value)
      .then((response) => {
        const data = response.data.data;
        setSelectedProgram(response.data.data);
        form.setFieldsValue({
          title: response.data.data.attributes.title,
          description: response.data.data.attributes.description,
          titleInternal: response.data.data.attributes.titleInternal,
          duration: dayjs(+response.data.data.attributes.duration),
          thumbnail: response.data.data.attributes.thumbnail,
          keywords: response.data.data.attributes.keywords,
          active: response.data.data.attributes.active,
          approved: response.data.data.attributes.approved,
          videoPublishDate: dayjs(
            response.data.data.attributes.videoPublishDate
          ),
        });
      })
      .catch(({ response }) => {
        notification.error({
          message:
            response.data.error.message ||
            "Error al obtener los detalles del programa",
        });
      });
  };

  const fetchPrograms = () => {
    programService
      .get({
        _limit: -1,
        populate: {},
        fields: {
          0: "title",
        },
      })
      .then((response) => {
        setPrograms(response.data.data);
      })
      .catch(({ response }) => {
        notification.error({
          message:
            response?.data?.error?.message || "Error al obtener los programas",
        });
      });
  };
  const handleProgram = () => {
    const program = programs.filter(
      (program) =>
        program.attributes.title === currentSchedule?.attributes.programid
    );
    return program[0]?.id;
  };
  useEffect(() => {
    if (currentSchedule) {
      form.setFieldsValue({
        title: currentSchedule.attributes.title,
        thumbnail: currentSchedule.attributes.thumbnail,
        duration: dayjs(+currentSchedule.attributes.duration),
        description: currentSchedule.attributes.description,
        program: handleProgram(),
        start: dayjs(currentSchedule.attributes.start),
        end: dayjs(currentSchedule.attributes.end),
        season: currentSchedule.attributes.season,
        episode: currentSchedule.attributes.episode,
        programtype: currentSchedule.attributes.programtype,
        ratingage: currentSchedule.attributes.ratingage,
        titleinternal: currentSchedule.attributes.titleinternal,
        videopublishdate: dayjs(currentSchedule.attributes.videopublishdate),
        videoid: currentSchedule.attributes.videoid,
        videoidpartner: currentSchedule.attributes.videoidpartner,
        genre: currentSchedule.attributes.genre,
        subgenre: currentSchedule.attributes.subgenre,
        series: currentSchedule.attributes.series,
        keywords: currentSchedule.attributes.keywords,
        parentalrating: currentSchedule.attributes.parentalrating,
        country: currentSchedule.attributes.country,
        language: currentSchedule.attributes.language,
        contentformat: currentSchedule.attributes.contentformat,
        provider: currentSchedule.attributes.channelprovider,
      });
    }
  }, [currentSchedule, form]);
  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    selectedProgram && updateEnumValues();
  }, [selectedProgram]);

  const handleFinish = async (values: any) => {
    values.start = values.start.toISOString();
    (values.countryname = ""),
      (values.languagename = ""),
      (values.end = values.end.toISOString());
    values.program = selectedProgram?.id;
    values.programid = selectedProgram?.attributes.title;
    values.videopublishdate = values.videopublishdate.toISOString();
    values.duration = convertToSeconds(
      values.duration.format("HH:mm:ss")
    ).toString();

    if (isEditMode) {
      scheduleService
        .put(currentSchedule.id, values)
        .then(() => {
          notification.success({
            message: "Programación actualizado con éxito",
          });
          form.resetFields();
          onClose();
        })
        .catch(({ response }) => {
          notification.error({
            message:
              response.data.error.message ||
              "Error al actualizar el Programación",
          });
        });
    } else {
      scheduleService
        .post(values)
        .then(() => {
          notification.success({ message: "Programación creado con éxito" });
          fetchPrograms();
          form.resetFields();
          onClose();
        })
        .catch(({ response }) => {
          notification.error({
            message:
              response.data.error.message || "Error al crear el Programación",
          });
        });
    }
  };
  const handleClose = () => {
    onClose();
    form.resetFields();
  };

  const renderTabsItems: TabPaneProps[] = [{}];

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      size="large"
      title={isEditMode ? "EDITAR PROGRAMACIÓN" : "AGREGAR PROGRAMACIÓN"}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        // initialValues={defaultSelectValues()}
      >
        <Card
          actions={[
            <Button
              key="actBtnPrgrm"
              type="primary"
              htmlType="submit"
              size="large"
              // loading={loading}
              // disabled={loading}
            >
              <SaveFilled style={{ fontSize: 25 }} />
              <span style={{ fontSize: 18 }}>Guardar</span>
            </Button>,
          ]}
        >
          <Form.Item
            label="Programa"
            name="program"
            rules={[
              {
                required: true,
                message: "Seleccione un programa",
              },
            ]}
          >
            <Select
              options={programs.map((program) => ({
                label: program.attributes.title,
                value: program.id,
              }))}
              filterOption={filterOption}
              onChange={handleProgramChange}
              placeholder="Programa"
              showSearch
            />
          </Form.Item>
          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label="Fecha de inicio"
              name="start"
              rules={[
                {
                  required: true,
                  message: "Ingrese la fecha de inicio",
                },
              ]}
            >
              <DatePicker
                showTime={{ format: "HH:mm:ss", ...disabledStartTimes() }}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Fecha de inicio"
                onChange={onStartDateChange}
              />
            </Form.Item>
            <Form.Item
              label="Fecha de fin"
              name="end"
              rules={[
                {
                  required: true,
                  message: "Ingrese la fecha de fin",
                },
              ]}
            >
              <DatePicker
                disabledDate={disabledEndDate}
                showTime={{ disabledTime: disabledEndTimes }}
                placeholder="Fecha de fin"
              />
            </Form.Item>

            <Form.Item
              label="Thumbnail URL"
              name="thumbnail"
              rules={[
                {
                  required: true,
                  message: "Ingrese la url del thumbnail",
                },
              ]}
            >
              <Input placeholder="Thumbnail URL" />
            </Form.Item>
            <Form.Item
              label="Temporada"
              name="season"
              rules={[
                {
                  required: true,
                  message: "Ingrese la temporada",
                },
              ]}
            >
              <Input placeholder="Temporada" />
            </Form.Item>
            <Form.Item
              label="Espisodio"
              name="episode"
              rules={[
                {
                  required: true,
                  message: "Ingrese un episodio",
                },
              ]}
            >
              <InputNumber min={1} placeholder="Episodio" />
            </Form.Item>
            <Form.Item
              label="Tipo de programa"
              name="programtype"
              rules={[
                {
                  required: true,
                  message: "Ingrese el tipo de programa",
                },
              ]}
            >
              <Input placeholder="Tipo de programa" />
            </Form.Item>
            <Form.Item
              label="Edad de clasificación"
              name="ratingage"
              rules={[
                {
                  required: true,
                  message: "Ingrese la edad de clasificación",
                },
              ]}
            >
              <InputNumber min={1} placeholder="Edad de clasificación" />
            </Form.Item>
          </Row>
          {form.getFieldValue("program") && (
            <>
              <Form.Item
                label="Título"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Ingrese el título del programa",
                  },
                ]}
              >
                <Input placeholder="Título" />
              </Form.Item>
              <Form.Item
                label="Título interno"
                name="titleinternal"
                rules={[
                  {
                    required: true,
                    message:
                      "Ingrese el nombre del título interno del programa",
                  },
                ]}
              >
                <Input placeholder="Título interno" />
              </Form.Item>
              <Form.Item
                label="Descripción"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Ingrese la descripción del programa",
                  },
                ]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 5 }}
                  placeholder="Descripción"
                />
              </Form.Item>
              <Form.Item
                label="Fecha de Publicación"
                name="videopublishdate"
                rules={[
                  {
                    required: true,
                    message: "Ingrese la fecha de publicación del programa",
                  },
                ]}
              >
                <DatePicker placeholder="Fecha de Publicación" />
              </Form.Item>
              <Form.Item
                label="Duración"
                name="duration"
                rules={[
                  {
                    required: true,
                    message: "Ingrese la duración del programa",
                  },
                ]}
              >
                <TimePicker placeholder="Duración" />
              </Form.Item>
              {/* <Form.Item
                label="Tipo de programa"
                name={NomenclatorEnum.programtype}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el tipo de programa",
                  },
                ]}
              >
                <Input placeholder="Tipo de programa" />
              </Form.Item> */}
              <Form.Item
                label="Id de Video"
                name={NomenclatorEnum.videoid}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el id de video",
                  },
                ]}
              >
                <Input placeholder="Id de Video" />
              </Form.Item>
              <Form.Item
                label="Id de Video Partner"
                name="videoidpartner"
                rules={[
                  {
                    required: true,
                    message: "Ingrese el id de video partner",
                  },
                ]}
              >
                <Input placeholder="Id de Video Partner" />
              </Form.Item>
              <Form.Item
                label="Género"
                name={NomenclatorEnum.genre}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el género",
                  },
                ]}
              >
                <Input placeholder="Géneros" />
              </Form.Item>
              <Form.Item
                label="SubGénero"
                name={NomenclatorEnum.subgenre}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el subgénero",
                  },
                ]}
              >
                <Input placeholder="SubGéneros" />
              </Form.Item>
              <Form.Item
                label="Serie"
                name={NomenclatorEnum.series}
                rules={[
                  {
                    required: true,
                    message: "Ingrese la serie",
                  },
                ]}
              >
                <Input placeholder="Series" />
              </Form.Item>
              <Form.Item label="Palabras claves" name="keywords">
                <Input placeholder="adultos, accion..." />
              </Form.Item>
              <Form.Item
                label="Control parental"
                name={NomenclatorEnum.parentalrating}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el tipo control parental",
                  },
                ]}
              >
                <Input placeholder="Tipo de Control parental" />
              </Form.Item>
              <Form.Item
                label="País"
                name={NomenclatorEnum.country}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el País",
                  },
                ]}
              >
                <Input placeholder="País" />
              </Form.Item>
              <Form.Item
                label="Idioma"
                name={NomenclatorEnum.language}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el Idioma",
                  },
                ]}
              >
                <Input placeholder="Idioma" />
              </Form.Item>
              <Form.Item
                label="Formato"
                name={NomenclatorEnum.contentformat}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el Formato",
                  },
                ]}
              >
                <Input placeholder="Formato" />
              </Form.Item>

              <Form.Item
                label="Proveedor de Canal"
                name={NomenclatorEnum.channelprovider}
                rules={[
                  {
                    required: true,
                    message: "Ingrese el Canal",
                  },
                ]}
              >
                <Input placeholder="Proveedor de Canal" />
              </Form.Item>
              <Form.Item
                label="Thumbnail URL"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Ingrese la url del thumbnail",
                  },
                ]}
              >
                <Input placeholder="Thumbnail URL" />
              </Form.Item>
            </>
          )}
        </Card>
      </Form>
    </Drawer>
  );
};

export default NewEditScheduleForm;
