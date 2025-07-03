import api from "./api.service";
import { validate } from "./functions";

export async function getAllCrons() {
  const res = await api().get("crons/getallcrons");
  return validate(res);
}

export async function getSkypeNotification() {
  const res = await api().get("crons/getSkypeNotification");
  return validate(res);
}

export async function updateSkypeNotification(data) {
  const res = await api().post("crons/updateSkypeNotification", data);
  return validate(res);
}

export async function scheduleCron(data) {
  const res = await api().post("crons/schedulecron", data);
  return validate(res);
}

export async function rescheduleCron(data) {
  const res = await api().post("crons/rescheduleCron", data);
  return validate(res);
}

export async function updateCronStatus(data) {
  const res = await api().post("crons/updateCronStatus", data);
  return validate(res);
}

export async function instantRunCron(data) {
  const res = await api().post("crons/instantRunCron", data);
  return validate(res);
}

export async function updateDescription(data) {
  const res = await api().post("crons/updateDescription", data);
  return validate(res);
}
