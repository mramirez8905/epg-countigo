/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { IChannelResponse } from "@/interfaces/channel.interface";
import { channelsService } from "@/services/channel.services";
import { SaveFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  notification,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { listTimeZones } from "timezone-support";
import React, { useEffect, useState } from "react";
import useNomenclators from "../programas/nomenclators.hook";
import { NomenclatorEnum } from "@/types/nomencladores";
import { INomenclatorResponse } from "@/interfaces/nomenclador.interface";
import moment from "moment-timezone";
import { filterOption } from "@/utils/filter-search";

const stateActivoMapping: { [key: number]: boolean } = {
  15: true,
  16: false,
};
type NewEditCanalFormProps = {
  open: boolean;
  onClose: () => void;
  currentCanal?: IChannelResponse;
};
const sharedProps = {
  style: {
    width: "100%",
    maxWidth: 300,
  },
};

const NewEditCanalForm = ({
  currentCanal,
  open,
  onClose,
}: NewEditCanalFormProps) => {
  const isEditMode = !!currentCanal;
  const [form] = useForm();
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");
  const [timeZoneMapping, setTimeZoneMapping] = useState<
    Record<string | number, any>
  >({});

  useEffect(() => {
    const zones = listTimeZones();
    const mapping: Record<string | number, any> = {};
    zones.forEach((zone: string | number, index: any) => {
      mapping[zone] = index;
    });
    setTimeZoneMapping(mapping);
    if (!isEditMode) {
      const defaultTimeZoneName = zones[0];
      setSelectedTimeZone(defaultTimeZoneName);
      form.setFieldsValue({ timezone: mapping[defaultTimeZoneName] });
    }
  }, []);

  const handleTimeZoneChange = (selectedOption: { label: any }) => {
    const name = selectedOption.label.split(") ")[1];
    form.setFieldsValue({ timezoneName: name });
  };

  const handleDimensionChange = (changedValues: any, allValues: any) => {
    const width = changedValues.width || allValues.width;
    const height = changedValues.height || allValues.height;

    if (width && height) {
      form.setFieldsValue({ resolution: `${width}x${height}` });
    }
  };
  const handleStatusChange = (statusId: number) => {
    const isActivo =
      statusId !== undefined && statusId in stateActivoMapping
        ? stateActivoMapping[statusId]
        : false;
    form.setFieldsValue({ active: isActivo });
  };
  const nomenclators = useNomenclators();

  const [resolution, setResolution] = useState("");
  useEffect(() => {
    const width = form.getFieldValue("width");
    const height = form.getFieldValue("height");
    if (width && height) {
      setResolution(`${width}x${height}`);
    }
  }, [form]);
  const getValue = (list: INomenclatorResponse[], value: NomenclatorEnum) => {
    return list.find((item) => item.attributes.type === value)?.id;
  };

  const updateEnumValues = () => {
    Object.keys(NomenclatorEnum).forEach((key) => {
      form.setFieldsValue({
        [key]: getValue(
          currentCanal?.attributes.nomencladors.data!,
          key as NomenclatorEnum
        ),
      });
    });
  };
  useEffect(() => {
    if (currentCanal) {
      form.setFieldsValue({
        id: currentCanal.id,
        name: currentCanal.attributes.name,
        description: currentCanal.attributes.description,
        country: currentCanal.attributes.country,
        thumbnail: currentCanal.attributes.thumbnail,
        resolution: currentCanal.attributes.resolution,
        width: currentCanal.attributes.width,
        scheduleLastUpdated: dayjs(
          currentCanal.attributes.updatedAt
        ),
        timezone: dayjs(currentCanal.attributes.timezone).toISOString(),
        height: currentCanal.attributes.height,
        tracker: currentCanal.attributes.tracker,
        timezoneName: currentCanal.attributes.timezoneName,
        unique_id: currentCanal.attributes.unique_id,
      });
      currentCanal && updateEnumValues();
    } else {
      form.resetFields();
    }
  }, [currentCanal, form]);
  const handleError = ({ response }: any) => {
    notification.error({
      message: response.data.error.message || "Error al actualizar el canal",
    });
  };

  const handleFinish = async (values: any) => {
    console.log(values);
    values.nomencladors = Object.keys(NomenclatorEnum).map((key) =>
      form.getFieldValue(key)
    );

    Object.keys(NomenclatorEnum).forEach((key) => {
      delete values[key];
    });
    values.nomencladors = values.nomencladors.filter(
      (nomenclator: any) => nomenclator > 0
    );
    values.subgenre = "";
    values.genre = "";
    values.language = "";
    values.parentalrating = "";
    values.countryname = "";
    values.status = "";
    values.scheduleLastUpdated = values.scheduleLastUpdated.toISOString();
    values.timezone = moment().toISOString();
    if (isEditMode) {
      channelsService
        .put(currentCanal.id, values)
        .then(() => {
          notification.success({
            message: "Canal actualizado con éxito",
          });
          form.resetFields();
          onClose();
        })
        .catch(({ response }: { response: any }) => {
          notification.error({
            message:
              response.data.error.message || "Error al actualizar el canal",
          });
        });
    } else {
      channelsService
        .post(values)
        .then(() => {
          notification.success({ message: "Canal creado con éxito" });
          form.resetFields();
          onClose();
        })
        .catch(({ response }: { response: any }) => {
          notification.error({
            message: response.data.error.message || "Error al crear el canal",
          });
        });
    }
  };
  const timeZoneOptions = listTimeZones().map((zone: string) => {
    const offset = moment.tz(zone).utcOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const offsetString = `UTC${offset < 0 ? "-" : "+"}${offsetHours
      .toString()
      .padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

    return {
      label: `(${offsetString}) ${zone}`,
      value: zone,
      name: zone,
    };
  });
  const defaultSelectValues = () => {
    return !currentCanal
      ? {
          [NomenclatorEnum.language]: nomenclators?.language[0]?.value,
          timezone: timeZoneOptions[0]?.value,
          timezoneName: timeZoneOptions[0]?.name,
          subgenre: "",
          genre: "",
          parentalrating: "",
        }
      : undefined;
  };
  // let scheduleLastUpdated = form.getFieldValue("scheduleLastUpdated");
  // let dateValue = scheduleLastUpdated ? dayjs(scheduleLastUpdated) : null;
  return (
    <Drawer
      title={isEditMode ? "EDITAR CANAL" : "AGREGAR CANAL"}
      placement={"right"}
      onClose={onClose}
      open={open}
      size="large"
    >
      <Form
        onValuesChange={handleDimensionChange}
        form={form}
        onFinish={handleFinish}
        name="newChannel"
        initialValues={defaultSelectValues()}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 15,
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          actions={[
            <Button
              key={"actBtn"}
              type="primary"
              htmlType="submit"
              size="large"
            >
              <SaveFilled style={{ fontSize: 25 }} />
              <span style={{ fontSize: 18 }}>Guardar</span>
            </Button>,
          ]}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nombre"
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Nombre del canal" {...sharedProps} />
              </Form.Item>

              <Form.Item
                label="Descripción"
                name="description"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Descripción" {...sharedProps} />
              </Form.Item>

              <Form.Item label="Estado" name={NomenclatorEnum.channelstatus}>
                <Select
                  showSearch
                  filterOption={filterOption}
                  placeholder="Estado"
                  {...sharedProps}
                  options={nomenclators?.channelstatus}
                  onChange={handleStatusChange}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label="Idioma"
                name={NomenclatorEnum.language}
                rules={[
                  { required: true, message: "Por favor selecciona un idioma" },
                ]}
              >
                <Select
                  showSearch
                  filterOption={filterOption}
                  placeholder="Idioma"
                  {...sharedProps}
                  options={nomenclators?.language}
                />
              </Form.Item>
              <Form.Item
                label="Proveedor"
                name={NomenclatorEnum.channelprovider}
              >
                <Select
                  allowClear
                  showSearch
                  filterOption={filterOption}
                  placeholder="Proveedor"
                  {...sharedProps}
                  options={nomenclators?.channelprovider}
                />
              </Form.Item>
              <Form.Item
                label="URL de imagen"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="URL de imagen" {...sharedProps} />
              </Form.Item>

              <Form.Item
                label="Ancho de resolución"
                name="width"
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const pattern = /^\d{3,4}$/;
                      if (!pattern.test(value.toString())) {
                        return Promise.reject(
                          new Error(
                            "Por favor ingresa un número entero de 4 dígitos"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder="Ancho de resolución"
                  {...sharedProps}
                />
              </Form.Item>
              <Form.Item
                label="Altura de resolución"
                name="height"
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const pattern = /^\d{3,4}$/;
                      if (!pattern.test(value.toString())) {
                        return Promise.reject(
                          new Error(
                            "Por favor ingresa un número entero de 3 o 4 dígitos"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  placeholder="Altura de resolución"
                  {...sharedProps}
                />
              </Form.Item>
              <Form.Item label="Resolución" name="resolution">
                <Input
                  placeholder="Resolución"
                  value={resolution}
                  readOnly
                  {...sharedProps}
                />
              </Form.Item>

              {isEditMode ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Form.Item
                    label="Activo"
                    name="active"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </div>
              ) : undefined}
            </Col>
            <Col span={12}>
              {!isEditMode && (
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Por favor, introduce el ID único",
                    },
                  ]}
                  label="ID único"
                  name="unique_id"
                >
                  <InputNumber
                    min={0}
                    placeholder="ID único"
                    {...sharedProps}
                  />
                </Form.Item>
              )}
              {isEditMode ? (
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Por favor, introduce el ID único",
                    },
                  ]}
                  label="ID único"
                  name="unique_id"
                >
                  <InputNumber
                    min={0}
                    placeholder="ID único"
                    {...sharedProps}
                  />
                </Form.Item>
              ) : undefined}
              <Form.Item
                label="Fecha de creación"
                name="scheduleLastUpdated"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker
                  // value={dateValue}
                  placeholder="Fecha de creación"
                  {...sharedProps}
                />
              </Form.Item>
              <Form.Item label="Género" name={NomenclatorEnum.genre}>
                <Select
                  allowClear
                  showSearch
                  filterOption={filterOption}
                  placeholder="Género"
                  {...sharedProps}
                  options={nomenclators?.genre}
                />
              </Form.Item>
              <Form.Item label="Subgénero" name={NomenclatorEnum.subgenre}>
                <Select
                  allowClear
                  showSearch
                  filterOption={filterOption}
                  placeholder="Subgénero"
                  {...sharedProps}
                  options={nomenclators?.subgenre}
                />
              </Form.Item>
              <Form.Item label="Nombre de la zona horaria" name="timezoneName">
                <Input
                  placeholder="Nombre de la zona horaria"
                  value={selectedTimeZone}
                  readOnly
                  {...sharedProps}
                />
              </Form.Item>
              <Form.Item
                label="Zona Horaria"
                name="timezone"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona una zona horaria",
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  filterOption={filterOption}
                  onChange={handleTimeZoneChange}
                  placeholder="Zonas Horarias"
                  {...sharedProps}
                  options={timeZoneOptions}
                />
              </Form.Item>

              <Form.Item
                label="Control parental del canal "
                name={NomenclatorEnum.parentalrating}
              >
                <Select
                  showSearch
                  filterOption={filterOption}
                  placeholder="Control parental del canal"
                  {...sharedProps}
                  options={nomenclators?.parentalrating}
                />
              </Form.Item>
              <Form.Item label="Tracker del canal" name="tracker">
                <Input placeholder="Tracker del canal" {...sharedProps} />
              </Form.Item>
              <Form.Item label="País" name={NomenclatorEnum.country}>
                <Select
                  allowClear
                  showSearch
                  filterOption={filterOption}
                  placeholder="País"
                  {...sharedProps}
                  options={nomenclators?.country}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Drawer>
  );
};

export default NewEditCanalForm;
