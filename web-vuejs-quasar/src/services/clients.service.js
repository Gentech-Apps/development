import api from "./api.service";
import * as functions from "./functions";

export async function fetchAllClients() {
  const res = await api().get("/clients/all");
  return functions.validate(res);
}
export async function fetchClientByID(id) {
  const res = await api().get("/clients/" + id);
  return functions.validate(res);
}
export async function addClient(data) {
  const res = await api().post("/clients/addClient", data);
  return functions.validate(res);
}
export async function updateClientById(data) {
  const res = await api().post("/clients/updateClient/" + data.id, data);
  return functions.validate(res);
}
export async function updateClientStatus(data) {
  const res = await api().post("/clients/updateClientStatus/" + data.id, data);
  return functions.validate(res);
}

export async function updateClientStatusByLeaveShow(data) {
  const res = await api().post("/clients/updateClientStatusByLeaveShow", data);
  return functions.validate(res);
}