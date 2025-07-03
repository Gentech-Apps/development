import api from "./api.service";
import * as functions from "./functions";
import Vue from "vue";

export async function fetchAccrualConfigRecords() {
  const res = await api().get("/accruals/fetchAccrualConfiguration");
  return functions.validate(res);
}

export async function addAccrualConfigRecords(data) {
  const res = await api().post("/accruals/addAccrualConfiguration", data);
  return functions.validate(res);
}

export async function addBonusRulesRecords(data) {
  const res = await api().post("/bonus/addBonusRuleConfiguration", data);
  return functions.validate(res);
}

export async function fetchBonusRuleConfiguration() {
  const res = await api().get("/bonus/fetchBonusRuleConfiguration");
  return functions.validate(res);
}

export async function deleteAccrualConfigRecords(Id, softDeleted) {
  const res = await api().post("/accruals/deleteAccrualConfiguration", {
    userId: Id,
    softDeleted: softDeleted,
  });
  return functions.validate(res);
}

export async function deleteBonusConfigRecords(Id) {
  const res = await api().post("/bonus/deleteBonusConfigRecords", {
    userId: Id,
  });
  return functions.validate(res);
}

export async function enableAccrualConfigRecords(Id) {
  const res = await api().post("/accruals/enableAccrualConfiguration", {
    Id: Id,
  });
  return functions.validate(res);
}

export async function updateAccrualConfigRecords(data) {
  const res = await api().post("/accruals/updateAccrualConfiguration", data);
  return functions.validate(res);
}

export async function updateBonusRulesRecords(data) {
  const res = await api().post("/bonus/updateBonusRulesRecords", data);
  return functions.validate(res);
}

export async function leaveAccrualsByUserId(data) {
  const res = await api().post("/leaves/leaveAccrualsByUserId", data);
  return functions.validate(res);
}

export async function updateBonusUsersRecords(data) {
  const res = await api().post("/bonus/updateBonusUsersRecords", data);
  return functions.validate(res);
}

export async function rejectBonusUsersRecords(data) {
  const res = await api().post("/bonus/rejectBonusUsersRecords", data);
  return functions.validate(res);
}

export async function fetchAllBonusFilter(data) {
  const res = await api().post("/bonus/fetchAllBonusFilter", data);
  return functions.validate(res);
}
