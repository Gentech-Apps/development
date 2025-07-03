import api from "./api.service";
import * as functions from "./functions";

export async function getAll360Categories() {
  const res = await api().get("360categories/getAllCategory");
  return functions.validate(res);
}
export async function add360Category(data) {
  const res = await api().post("360categories/addCategory", data);
  return functions.validate(res);
}
export async function update360Category(data) {
  const res = await api().put("360categories/updateCategory", data);
  return functions.validate(res);
}
export async function updateCategoryActiveStatus(data) {
  const res = await api().put("360categories/updateCategoryActiveStatus", data);
  return functions.validate(res);
}
export async function add360CategoryParameter(data) {
  const res = await api().post("360categories/category/addParameter", data);
  return functions.validate(res);
}
export async function update360CategoryParameter(data) {
  const res = await api().put("360categories/category/updateParameter", data);
  return functions.validate(res);
}
export async function getAll360CategoryParametersByCategoryId(data) {
  const res = await api().post(
    "360categories/category/getAllParametersByCategoryId",
    data,
  );
  return functions.validate(res);
}
export async function updateParameterActiveStatus(data) {
  const res = await api().put(
    "360categories/category/updateParameterActiveStatus",
    data,
  );
  return functions.validate(res);
}
export async function getAllActiveCategory() {
  const res = await api().get("360categories/getAllActiveCategory");
  return functions.validate(res);
}
export async function updateCategoryEditStatus(data) {
  const res = await api().put("360categories/updateCategoryEditStatus", data);
  return functions.validate(res);
}

export async function saveParticipantFeedBack(data) {
  const res = await api().post("feedBackForm/saveParticipantFeedBack", data);
  return functions.validate(res);
}

export async function getFeedBackDataByParticipantId(data) {
  const res = await api().post(
    "feedBackForm/getFeedBackDataByParticipantId",
    data,
  );
  return functions.validate(res);
}

export async function getAllFeedbackForUser(data) {
  const res = await api().post("feedBackForm/getAllFeedbackForUser", data);
  return functions.validate(res);
}

export async function checkIfCategoryOrParameterIsAlreadyExist(data) {
  const res = await api().post(
    "360categories/checkIfCategoryOrParameterIsAlreadyExist",
    data,
  );
  return functions.validate(res);
}
