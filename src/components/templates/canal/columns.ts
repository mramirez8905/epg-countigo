import { CountTVColumnsType } from "@/interfaces/strapiBase.interface";
function getNameFromData(data: { attributes: { name: any } }) {
  return data && data.attributes ? data.attributes.name : "";
}
export const columns: CountTVColumnsType<any>[] = [
  {
    title: "Nombre",
    dataIndex: "attributes",
    dataType: "string",
    width: 150,
    key: "name",
    ellipsis: true,
    render: (attributes) => `${attributes?.name}`,
    sorter: true, //(a, b) => a.attributes.nombre.length - b.attributes.nombre.
  },
  {
    title: "Descripción",
    dataIndex: "attributes",
    dataType: "string",
    key: "description",
    render: (attributes) => `${attributes.description || ""}`,
    ellipsis: true,
    width: 150,
  },
  {
    title: "Miniatura",
    dataIndex: "attributes",
    render: (attributes) => `${attributes.thumbnail || ""}`,
    ellipsis: true,
    width: 150,
    key: "thumbnail",
    dataType: "string",
  },
  {
    title: "Resolución",
    dataIndex: "attributes",
    render: (attributes) =>
      `${attributes.width || ""}x${attributes.height || ""}`,
    ellipsis: true,
    width: 150,
    key: "resolution",
    dataType: "string",
  },
  {
    title: "Ancho",
    dataIndex: "attributes",
    render: (attributes) => `${attributes.width || ""}`,
    ellipsis: true,
    width: 150,
    key: "width",
    dataType: "number",
  },

  {
    title: "Altura",
    dataIndex: "attributes",
    render: (attributes) => {
      return `${attributes.height || ""}`;
    },
    ellipsis: true,
    width: 150,
    key: "height",
    dataType: "number",
  },
  {
    title: "Rastreador",
    dataIndex: "attributes",
    render: (attributes) => `${attributes.tracker || ""}`,
    ellipsis: true,
    width: 150,
    key: "tracker",
    dataType: "string",
  },
  {
    title: "Nombre de la zona horaria",
    dataIndex: "attributes",
    render: (attributes) => `${attributes.timezoneName || ""}`,
    ellipsis: true,
    width: 150,
    dataType: "string",
    key: "timezoneName",
  },
];
