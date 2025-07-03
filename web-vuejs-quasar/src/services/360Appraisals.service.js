import api from "./api.service";
import * as functions from "./functions";

export async function findByUsersIdAndAppraisalId(data) {
  const res = await api().post(
    "360Appraisals/getAllByUserIdAndAppraisalId",
    data,
  );
  return functions.validate(res);
}
export async function addNewInitiate360(data) {
  const res = await api().post("360Appraisals/addNew360Appraisal", data);
  return functions.validate(res);
}
export async function getAll360Appraisals(data) {
  const res = await api().post("360Appraisals/getAll360Appraisals", data);
  return functions.validate(res);
}
export async function update360AppraisalDetails(data) {
  const res = await api().put("360Appraisals/update360Appraisal", data);
  return functions.validate(res);
}
