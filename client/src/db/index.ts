import Dexie from "dexie";

export default function getIndexDB() {
  const db = new Dexie("BookingDB");

  db.version(1).stores({
    timeSlots: "id++, shortDate, fullDate",
  });

  return db;
}
