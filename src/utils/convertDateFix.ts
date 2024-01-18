export const ConvertDateFix = (date: any) => {
  let time;
  if (date && date.toISOString() != "") {
    time =
      date.$Y +
      ":" +
      (date.$M + 1 < 10 ? "0" + date.$M + 1 : date.$M + 1) +
      ":" +
      (date.$D < 10 ? "0" + date.$D : date.$D); //date.toISOString().split("T")[0];
    time += "T" + (date.$H < 10 ? "0" + date.$H : date.$H);
    time += date.$m < 10 ? ":0" + date.$m : ":" + date.$m;
    time += date.$s < 10 ? ":0" + date.$s : ":" + date.$s;
    time += ".000Z";
  }
  return time;
};
