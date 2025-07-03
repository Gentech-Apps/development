import api from "./api.service";
import * as functions from "./functions";

export async function fetchSelfForm() {
  const res = await api().get("appraisalForms/getAllSelfAppraisalQuestions");
  return functions.validate(res);
}
export async function fetchLeadForm() {
  const res = await api().get("appraisalForms/getAllLeadAppraisalQuestions");
  return functions.validate(res);
}
export async function addAppraisalForm(data) {
  const res = await api().post("appraisalForms/addAppraisalForm", data);
  return functions.validate(res);
}
export async function updateAppraisalForm(data) {
  const res = await api().post("appraisalForms/updateAppraisalForm", data);
  return functions.validate(res);
}
export async function fetchDueAppraisals(userId, showMore) {
  const res = await api().get(
    "appraisals/getDueAppraisals/" + userId + "/" + showMore,
  );
  return functions.validate(res);
}
export async function fetchDueAppraisalsByFilter(userId, data) {
  data.userId = userId;
  const res = await api().post("appraisals/getDueAppraisalsByFilter/", data);
  return functions.validate(res);
}
export async function fetchMyAppraisals(id) {
  const res = await api().get("appraisals/getMyAppraisals/" + id);
  return functions.validate(res);
}
export async function fetchMyAppraisalsByFilter(id, data) {
  data._id = id;
  const res = await api().post("appraisals/getMyAppraisalsByFilter", data);
  return functions.validate(res);
}
export async function fetchLeadAppraisals(id, showMore) {
  const res = await api().get(
    "appraisals/getLeadAppraisals/" + id + "/" + showMore,
  );
  return functions.validate(res);
}
export async function fetchLeadAppraisalsByFilter(id, data) {
  data._id = id;
  const res = await api().post("appraisals/getLeadAppraisalsByFilter", data);
  return functions.validate(res);
}
export async function fetchReviewerAppraisals(id, showMore) {
  const res = await api().get(
    "appraisals/getReviewerAppraisals/" + id + "/" + showMore,
  );
  return functions.validate(res);
}
export async function fetchReviewerAppraisalsByFilter(id, data) {
  data._id = id;
  const res = await api().post(
    "appraisals/getReviewerAppraisalsByFilter",
    data,
  );
  return functions.validate(res);
}
export async function fetchSelfAppraisalFormOfUser(id) {
  const res = await api().get("appraisals/fetchSelfAppraisalFormOfUser/" + id);
  return functions.validate(res);
}
export async function fetchSelfAppraisalForm(id) {
  const res = await api().get("appraisals/getSelfAppraisalForm/" + id);
  return functions.validate(res);
}
export async function updateSelfAppraisalForm(data) {
  const res = await api().post("appraisals/updateSelfAppraisalForm", data);
  return functions.validate(res);
}
export async function fetchAllCompletedAppraisals(userId, showMore) {
  const res = await api().get(
    "appraisals/getAllCompletedAppraisals/" + userId + "/" + showMore,
  );
  return functions.validate(res);
}
export async function fetchAllCompletedAppraisalsByFilter(userId, data) {
  data.userId = userId;
  const res = await api().post(
    "appraisals/getAllCompletedAppraisalsByFilter/",
    data,
  );
  return functions.validate(res);
}
export async function fetchCurrentAppraisalForm(data) {
  const res = await api().post("appraisals/fetchCurrentAppraisalForm/", data);
  return functions.validate(res);
}
export async function updateContinuedFunction(id, data) {
  const res = await api().post(
    "appraisals/updateContinuedFunction/" + id,
    data,
  );
  return functions.validate(res);
}
export async function deleteAppraisalFunction(id) {
  const res = await api().post("appraisals/deleteAppraisalFunction/" + id);
  return functions.validate(res);
}
export async function updateAppraisal(id, id1, status, data) {
  const res = await api().post(
    "appraisals/updateAppraisal/" + id + "/" + id1 + "/" + status,
    data,
  );
  return functions.validate(res);
}
export async function getSingleUserData(id) {
  const res = await api().post("appraisals/getSingleUserData/" + id);
  return functions.validate(res);
}
export async function updateStartFormAppraisalDates(id, data) {
  const res = await api().post(
    "appraisals/updateStartFormAppraisalDates/" + id,
    data,
  );
  return functions.validate(res);
}
export async function fetchRatings() {
  const res = await api().get("ratings/fetchRatings");
  return functions.validate(res);
}
export async function updateRatings(data) {
  const res = await api().post("ratings/updateRatings", data);
  return functions.validate(res);
}
export async function addRatings(data) {
  const res = await api().post("ratings/addRatings", data);
  return functions.validate(res);
}
export async function updateStatus(status, id, id1, data) {
  const res = await api().post(
    "appraisals/updateStatus/" + status + "/" + id + "/" + id1,
    data,
  );
  return functions.validate(res);
}
export async function fetchLeadsByUser(id) {
  const res = await api().get("appraisals/fetchLeadsByUser/" + id);
  return functions.validate(res);
}
export async function fetchLeadsByManager(id) {
  const res = await api().get("appraisals/fetchLeadsByManager/" + id);
  return functions.validate(res);
}
export async function fetchAllLeads() {
  const res = await api().get("appraisals/fetchAllLeads");
  return functions.validate(res);
}
export async function getAllProjectByTimesheets(data) {
  const res = await api().post("appraisals/getAllProjectByTimesheets", data);
  return functions.validate(res);
}
export async function fetchQuestions(id) {
  const res = await api().get("appraisals/fetchQuestions/" + id);
  return functions.validate(res);
}
export async function addOrganizationProjects(
  id,
  value,
  data,
  projectData,
  selfFormData,
) {
  var DATA = {
    clientData: data,
    projectData: projectData,
    selfFormData: selfFormData,
  };
  const res = await api().post(
    "appraisals/addOrganizationProjects/" + id + "/" + value,
    DATA,
  );
  return functions.validate(res);
}
export async function deleteOrganizationProjects(
  appraisalId,
  id,
  data,
  projectData,
  selfFormData,
) {
  var DATA = {
    clientId: data.client._id,
    projectId: projectData.project,
    selfFormData: selfFormData,
  };
  const res = await api().post(
    "appraisals/deleteOrganizationProjects/" + appraisalId + "/" + id,
    DATA,
  );
  return functions.validate(res);
}
export async function fetchProjects() {
  const res = await api().get("appraisals/fetchProjects");
  return functions.validate(res);
}
export async function fetchColleagues() {
  const res = await api().get("appraisals/fetchColleagues");
  return functions.validate(res);
}
export async function fetchImrpovementOpps(data) {
  const res = await api().post(
    "appraisalConclusions/fetchImrpovementOpp",
    data,
  );
  return functions.validate(res);
}
export async function addImprovementOpps(data) {
  const res = await api().post(
    "appraisalConclusions/addImprovementOpportunity",
    data,
  );
  return functions.validate(res);
}
export async function updateImprovementOpps(data) {
  const res = await api().post(
    "appraisalConclusions/updateImprovementOpps",
    data,
  );
  return functions.validate(res);
}
export async function fetch360CompletedAppraisals(userId, showMore) {
  const res = await api().get(
    "appraisals/fetch360CompletedAppraisals/" + userId + "/" + showMore,
  );
  return functions.validate(res);
}
export async function fetch360CompletedAppraisalsByFilter(userId, data) {
  data.userId = userId;
  const res = await api().post(
    "appraisals/fetch360CompletedAppraisalsByFilter",
    data,
  );
  return functions.validate(res);
}
export async function fetchAllConclusionHerarchyByMentorId(userId, showMore) {
  const res = await api().get(
    "appraisals/fetchAllConclusionHerarchyByMentorId/" +
      userId +
      "/" +
      showMore,
  );
  return functions.validate(res);
}
export async function fetchAllConclusionHerarchyByMentorIdByFilter(
  userId,
  data,
) {
  data._id = userId;
  const res = await api().post(
    "appraisals/fetchAllConclusionHerarchyByMentorIdByFilter",
    data,
  );
  return functions.validate(res);
}
export async function fetchMenteesCount(userId) {
  const res = await api().get("appraisals/fetchMenteesCount/" + userId);
  return functions.validate(res);
}

export async function getProjectsBYUserIdAndAprraisalId(userId, appraisalId) {
  const res = await api().get(
    "appraisals/getProjectsBYUserIdAndAprraisalId/" +
      userId +
      "/" +
      appraisalId,
  );
  return functions.validate(res);
}
export async function getDepartmentsByUser(userId) {
  const res = await api().get("appraisals/getDepartmentsByUser/" + userId);
  return functions.validate(res);
}
export async function fetchContributions() {
  const res = await api().get("contributions/fetchContributions");
  return functions.validate(res);
}
export async function updateContributions(data) {
  const res = await api().post("contributions/updateContributions", data);
  return functions.validate(res);
}
export async function addContributions(data) {
  const res = await api().post("contributions/addContributions", data);
  return functions.validate(res);
}
export async function fetchCompletedAppraisals(userId) {
  const res = await api().get("appraisals/fetchCompletedAppraisals/" + userId);
  return functions.validate(res);
}
export async function fetchCompletedAppraisalsByFilter(userId, data) {
  data.userId = userId;
  const res = await api().post(
    "appraisals/fetchCompletedAppraisalsByFilter",
    data,
  );
  return functions.validate(res);
}
export async function fetchLastConclusion(userId) {
  const res = await api().get(
    "appraisalConclusions/fetchLastConclusion/" + userId,
  );
  return functions.validate(res);
}
export async function getTotalLeavesAndTimesheetsHours(userdeets) {
  const res = await api().post(
    "appraisals/fetchTotalLeavesAndTimesheetsHours",
    userdeets,
  );
  return functions.validate(res);
}
export async function updateAppraisalLeads(leaddeets) {
  const res = await api().post("appraisals/updateAppraisalLeads", leaddeets);
  return functions.validate(res);
}
export async function fetchLeadsByAppraisal(id) {
  const res = await api().get("appraisals/fetchLeadsByAppraisal/" + id);
  return functions.validate(res);
}
export async function preparePDFForPerformanceAppraisalConclusion(bodyData) {
  const res = await api().post(
    "appraisals/preparePDFForPerformanceAppraisalConclusion",
    bodyData,
  );
  return functions.validate(res);
}
export async function fetchInitate360Data(id) {
  const res = await api().get("appraisals/fetchInitate360Data/" + id);
  return functions.validate(res);
}
export async function get360FeedbackSummaryOfUser(data) {
  const res = await api().post("appraisals/get360FeedbackSummaryOfUser", data);
  return functions.validate(res);
}
export async function updateDownloadStatus(appraisalId, data) {
  const res = await api().put(
    `appraisals/updateDownloadStatus/${appraisalId}`,
    data,
  );
  return functions.validate(res);
}
