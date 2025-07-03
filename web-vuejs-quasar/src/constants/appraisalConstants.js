export const AppraisalStatus = Object.freeze({
  DUE: "due",
  STARTED: "started",
  SELFCOMPLETED: "selfCompleted",
  LEADCOMPLETED: "leadCompleted",
  REVIEWCOMPLETED: "reviewCompleted",
  APPRAISALCOMPLETED: "appraisalCompleted",
  APPRAISALCLOSED: "appraisalClosed",
  IN360: "in360",
  INCONCLUSION: "inConclusion",
  CONCLUDED: "concluded",
  FEEDBACKCOMPLETED: "360Feedback",
  IN_PROGRESS: "inprogress",
});

export const FeedbackRatings = Object.freeze({
  GOOD: "good",
  AVERAGE: "average",
  BAD: "bad",
});

export const SelectContributionFilter = Object.freeze({
  ENTER_THE_CONTRIBUTION: "Enter the contribution",
});

export const SuccessMessages = Object.freeze({
  LEAD_REVIEWER_UPDATED_SUCCESS: "Lead/Reviewer updated successfully",
});

export const HTMLTagsRemovalRegex = Object.freeze({
  REMOVE_HTML_TAGS: /<[^>]*>/g,
});

export const ValidationMessages = Object.freeze({
  PLEASE_ENTER_CATEGORY_NAME: "Please enter Category Name!",
  PLEASE_ENTER_PARAMETER_NAME: "Please enter Paramenter Name!",
});

export const AppraisalTabs = Object.freeze({
  CURRENT: "Current",
});
