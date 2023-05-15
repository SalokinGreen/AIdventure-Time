import localforage from "localforage";

const db = localforage.createInstance({
  name: "AITdatabase",
});

export default db;
