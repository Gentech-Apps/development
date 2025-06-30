import { InactiveStatusModel } from '../../inactive-candidate/models/inactivateStatus.model';
import { PermissionLevel } from '../enums/PermissionLevel';
import { IAgoraOption } from '../interface/IAgoraOptions';
import { IButtonColorByMessage } from '../interface/IButtonColorByMessage';
import { LanguageModel } from '../models/language.model';
import { ObjectModel } from '../models/object.model';
import { ExportCsvColumn } from '../../examinee-marks/models/export-csv-column.model';

export const QualificaionList: string[] = ['M.Tech/ME', 'MCA', 'MSc', 'BE/B.Tech', 'MBA', 'Others'];

export const RouteWithoutLayout: (string | RegExp)[] = [
  '',
  '/register',
  /login?(.*)/,
  '/',
  /add-drive?(.*)/,
  /successful-registration?(.*)/,
  /registration-closed?(.*)/,
  '/objective',
  '/subjective-paper',
  '/question-type',
  /user-activity?(.*)/,
  /thank-you?(.*)/,
  /referral\/register?(.*)/,
  /referral\/my-referral?(.*)/,
  /register?(.*)/,
  /drive-setup\/preview-template?(.*)/,
  /[#]+/,
  /page-not-found?(.*)/,
  '/errors',
  /errors?(.*)/,
  /reset-password(.*)/,
  /reset-password\/(.*)/,
];

export const PublicRoute: string[] = ['/login', '', '/'];

export const InctiveStatusList: InactiveStatusModel[] = [
  { name: 'Back/Forward/Reload', value: 'Back/Forward/Reload' },
  { name: 'Admin Logout', value: 'AdminLogout' },
  { name: 'Completed', value: 'Completed' },
  { name: 'Focussed Out', value: 'FocussedOut' },
  { name: 'Meta Key Used', value: 'MetaKeyUsed' },
];

export const AgoraOption: IAgoraOption = {
  appId: '62ac9dd16a02421a8d782200bfc4828d',
  channel: '1000',
  token: null,
};

export const ButtonColorByMessage: IButtonColorByMessage = {
  success: '#93be3b',
  warning: '#93be3b',
  error: 'd33',
  info: '',
};

export const ColumnsForObjectiveQuestion: string[] = [
  'question',
  'option1',
  'option2',
  'option3',
  'option4',
  'answer',
  'levelofdifficulty',
];

export const ColumnsForSubjectiveQuestion: string[] = [
  'question',
  'modelanswer',
  'levelofdifficulty',
];

export const PaperCompilerOptions: ObjectModel[] = [
  { name: 'Open', value: 'Open' },
  { name: 'All Compilers', value: 'AllCompiler' },
  { name: 'Java Compiler', value: 'JavaCompiler' },
  { name: 'C# Compiler', value: 'C#Compiler' },
  { name: 'SQL Compiler', value: 'SQLCompiler' },
  { name: 'C Compiler', value: 'C-Compiler' },
  { name: 'C++ Compiler', value: 'C++Compiler' },
  { name: 'Javascript Compiler', value: 'JavascriptCompiler' },
  { name: 'No Compiler', value: 'NoCompiler' },
];

export const CategoryCompilerOptions: ObjectModel[] = [
  { name: 'All Compilers', value: 'AllCompiler' },
  { name: 'Java Compiler', value: 'JavaCompiler' },
  { name: 'C# Compiler', value: 'C#Compiler' },
  { name: 'SQL Compiler', value: 'SQLCompiler' },
  { name: 'C Compiler', value: 'C-Compiler' },
  { name: 'C++ Compiler', value: 'C++Compiler' },
  { name: 'Javascript Compiler', value: 'JavascriptCompiler' },
  { name: 'No Compiler', value: 'NoCompiler' },
];

export const CategoryLanguages: LanguageModel[] = [
  { name: 'JAVA', value: 'java', compilerType: 'JavaCompiler' },
  { name: 'C#', value: 'cs', compilerType: 'C#Compiler' },
  { name: 'SQL', value: 'sql', compilerType: 'SQLCompiler' },
  { name: 'C', value: 'c', compilerType: 'C-Compiler' },
  { name: 'C++', value: 'cpp', compilerType: 'C++Compiler' },
  { name: 'JavaScript', value: 'js', compilerType: 'JavascriptCompiler' },
];

export const PaperTypes = {
  SUBJECTIVE: 2,
  OBJECTIVE: 1,
  ALL: 0,
};

export const columnForImportUserOptions: string[] = [
  'firstName',
  'lastName',
  'mobileNumber',
  'email',
  'areaOfInterest',
  'examDate',
  'examTime',
];

export const AccessOrder: string[] = ['NA', 'VIEW', 'EDIT', 'ADD']; // all string must be in a capital letter

export const DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const emailRegex =
  /^[\s]*[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,3}(?:\.[a-z]{2,3})?[\s]*$/;
export const emailRegexWithPlus = /^(?!.*[._+-]{2})[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const columnOptionsForExamineeMarksExport: ExportCsvColumn[] = [
  {
    index: 1,
    name: 'User Id',
    value: 'userId',
  },
  {
    index: 2,
    name: 'Name',
    value: 'name',
  },
  {
    index: 3,
    name: 'Mobile Number',
    value: 'mobileNumber',
  },
  {
    index: 4,
    name: 'Email',
    value: 'email',
  },
  {
    index: 5,
    name: 'Exam Date',
    value: 'examDate',
  },
  {
    index: 6,
    name: 'Final Result',
    value: 'finalResult',
  },
  {
    index: 7,
    name: 'Final Mail Status',
    value: 'finalMailStatus',
  },
  {
    index: 8,
    name: 'Area Of Interest',
    value: 'areaOfInterestName',
  },
  {
    index: 9,
    name: 'Update Area Of Interest',
    value: 'updateAreaOfInterestName',
  },
  {
    index: 10,
    name: 'Paper 1 Name',
    value: 'paper1Name',
  },
  {
    index: 11,
    name: 'Paper 1 Marks',
    value: 'paper1Marks',
  },
  {
    index: 12,
    name: 'Paper 1 Status',
    value: 'paper1Status',
  },
  {
    index: 13,
    name: 'Paper 2 Name',
    value: 'paper2Name',
  },
  {
    index: 14,
    name: 'Paper 2 Marks',
    value: 'paper2Marks',
  },
  {
    index: 15,
    name: 'Paper 2 Status',
    value: 'paper2Status',
  },
  {
    index: 16,
    name: 'Paper 3 Name',
    value: 'paper3Name',
  },
  {
    index: 17,
    name: 'Paper 3 Marks',
    value: 'paper3Marks',
  },
  {
    index: 18,
    name: 'Paper 3 Status',
    value: 'paper3Status',
  },
];

export const PageRoutes = {
  AuthPage: '',
  ErrorPage: 'errors',
  PowerUserPage: 'power-user',
  DriveSetupPage: 'drive-setup',
  AddDrivePage: 'add-drive',
  DashboardPage: 'dashboard',
  PaperSetupPage: 'paper-setup',
  CandidatePage: 'candidates',
  ExamineeMarksPage: 'examinee-marks',
  InactiveCandidatePage: 'inactive-candidates',
  RefferalPage: 'referral',
  ObjectivePaperPage: 'objective',
  SubjectivePaperPage: 'subjective-paper',
  QuestionTypePage: 'question-type',
  UserActivityPage: 'user-activity',
  ThankyouPage: 'thank-you',
  RegisterPage: 'register',
  PreviewMessageTemplatePage: 'drive-setup/preview-template?type=',
  DriveListPage: 'drive-setup/drive-list',
  EmailTemplatesPage: 'drive-setup/email-templates',
  ScreenMessagesPage: 'drive-setup/screen-messages',
  PaperCutOff: 'drive-setup/paper-cutoff',
  EmailTemplates: 'email-templates',
  EmailTemplateListPage: 'email-templates/list',
  ExamineeMarksAnswerPage: 'examinee-marks/answers',
};

export const PublicChildRoutes: string[] = [
  `/${PageRoutes.RefferalPage}/my-referral`,
  `/${PageRoutes.RefferalPage}/register`,
];

export const LocalStorageKeys = {
  ActiveCandidate: 'active-candidate',
  UserType: 'userType',
  LoginId: 'loginId',
  UniqueLoginId: 'uniqueLoginId',
  DashboardDescription: 'dashboard-description',
  PaperCutOff: 'paper-cuttoff',
  LogIn: 'login',
  UrlMap: 'urlMap',
  RoleAndPermission: 'roles-and-permission',
  ActivePowerUser: 'active-power-user',
  LoginStatus: 'loginStatus',
  IsSessionExpired: 'isSessionExpired',
  Name: 'name',
  UserAgoraStatus: 'userAgoraStatus',
  CategoryId: 'categoryId',
  UserId: 'userId',
  IsStart: 'isStart',
  IsWalkIn: 'isWalkIn',
  Token: 'token',
  Load: 'load',
  ExamineeDriveId: 'examineeDriveId',
  AreaOfInterest: 'area-of-interest',
  IsChipClear: 'isChipClear',
  PreviewsData: 'previewData',
  PaperId: 'paperId',
  PaperName: 'paperName',
  LeftTimeMinutes: 'leftTimeMinutes',
  Inactive: 'Inactive',
  SelectedLanguage: 'selectedLanguage',
  QualificationGrid: 'qualification-grid',
};

export const HeaderNames = {
  ScreenMessageComponent: 'Screen Messages',
  PaperCutOffComponent: 'Paper Cutoff',
  CheckExamineeComponent: 'Examinee Answers',
  ExamineeRawDataComponent: 'Examinee Raw Data',
  RolesAndPermessionComponent: 'Roles & Permissions',
  AreaOfInteresComponent: 'Area Of Interest',
  AddDriveComponent: 'Add Drive',
  AddEmailGroupDialogHeader: 'Enter Email Template Name',
  AddMeesageGroupDialogHeader: 'Enter Screen Messages Template Name',
  ActivePowerUsers: 'Power Users',
  EmailTemplatesListComponent: 'Template List',
  CandidatesComponent: 'Candidates',
  DuplicateCandidatesListComponent: 'Duplicate Candidates List',
  DashboardDescriptionComponent: 'Dashboard Description',
  DashboardComponent: 'Dashboard',
  DrivesComponent: 'Drives',
  DriveTimeSlotComponent: 'Drive Time',
  EmailTemplatesComponent: 'Email Templates',
  HolidayComponent: 'Holidays',
  QualificationComponent: 'Qualification',
  SourceComponent: 'Source',
  ExamineeMarksComponent: 'Examinee Marks',
  ViewExamineePaperComponent: 'View Examinee Paper',
  QuestionListComponent: 'Questions',
  PaperListComponent: 'Papers',
  PaperTemplateComponent: 'Paper Structures',
  QuestionCategoryComponent: 'Question Categories',
  InactivePowerUserComponent: 'Inactive Power Users',
  ReferralsListComponent: 'Referrals',
};

export const InputLable = {
  EmailTemplateName: 'Email Template Name',
  MessageTemplateName: 'Screen Messages Template Name',
  Subject: 'Subject',
};

export const QueryParamNames = {
  Type: 'type',
};

export const PageTarget = {
  Blank: '_blank',
};

export const DependentRoute = {
  route: `/${PageRoutes.DriveListPage}`,
  requiredRoutes: [
    PageRoutes.EmailTemplatesPage,
    PageRoutes.ScreenMessagesPage,
    PageRoutes.PaperCutOff,
  ],
  access: PermissionLevel.ADD,
};

export const ResultMessageTitle = {
  Success: 'Success',
  UnableToContinue: 'Unable to continue',
  Thankyou: 'thank-you',
};

export const DialogMessages = {
  AreYouSureYouWantToSubmitThePaper: 'Are you sure you want to submit the paper?',
  Success: 'Success',
  Information: 'Info',
  ShortcutKeysAreNotSupported: 'Shortcut keys are not supported',
  MetaKeyIsNotAllowed:
    'Test Rule Violation - Meta (Windows) Key is not allowed, Your login is disabled. Please contact HR.',
  TestRuleViolationFocusedOut: 'Test Rule Violation - Focussed out',
  MovedOutOfTestAreaLoginDisabledPleaseContactHR:
    'You moved out of test area, Your login is disabled. Please contact HR.',
  TestRuleViolationIllegalMove: 'Test Rule Violation - Illegal move.',
  UsedBackForwardReloadLoginDisabledPleaseContactHR:
    'You used Back/Forward/Reload. Your login is disabled. Please contact HR.',
  NetworkIssue: 'Network Issue',
  PleaseCheckYourInternetConnectionBeforeSubmitPaper:
    'Please check your internet connection, Before submitting the paper',
  PleaseCheckYourInternetConnectionBeforeStartingPaper:
    'Please check your internet connection, Before starting paper',
  YouHaveAlreadyAttemptedThisPaper: 'You have already attempted this paper',
  PleaseChooseAnotherPaper: 'Please choose another paper',
  PleaseSelectALanguageFirst: 'Please select a language first',
  ItIsApplicableForThisSectionOnly: 'It is applicable for this section only',
  PaperSuccessfullySubmitted: 'Paper successfully submitted',
  EmptyField: 'Empty field!!',
  PleaseWriteYourCode: 'Please write your code.',
  InvalidOperation: 'Invalid operation',
  OperationCannotBePerformed: 'This operation cannot be performed!!',
  OnceYouChooseALanguageForThisSectionYouCantChangeIt:
    "Once you choose a language for this section, you can't change it.",
  CameraOrMicrophoneNotFound: 'Camera or microphone not found',
  LoginIPNotCorrect: 'Login IP is not correct',
  DeviceNotConnectedSameNetwork: 'Your Device Is Not Connected In Same Network',
  WarningTitle: 'Warning',
  ProfileNotAvailableText:
    'Your selected profile is not available at this time please contact the Invigilator',
  SelectLanguagePrompt: 'Please select language to start paper',
  SelectLanguage: 'Select Language',
  EnsureCameraOrMicrophoneWorking:
    'Please ensure that your camera or microphone is in working state',
  PaperLanguageChangeWarning:
    'Once your paper starts, you will not be able to change the selected language',
  YouWillNotAbleToRevertThis: "You won't be able to revert this!",
  MailConfirmationMessage: 'Are you sure you want to send mail?',
  ResetDriveConfirmationMessage: 'Are you sure you want to reset drive?',
  ResetDriveMessage:
    'Resetting a drive will cause a new list of questions to be shown to the examinee',
  Confimation: 'Are you sure?',
  Attention: 'Attention',
  IrreversibleWarning: "You won't be able to revert this!",
  IrreverseibleUndoWarning: "You won't be able to undo this!",
  DeleteHolidayConfirmation: 'Are you sure you want to delete holiday?',
  Empty: '',
  PleaseConfirm: 'Please Confirm',
  DeleteSourceConfirmation: 'Are you sure you want to delete source?',
  RejectReferralConfirmation: 'Are you sure you want to reject referral?',
  UpdateConfirmation: 'Are you sure you want to update?',
  MissingTotalTimeMessage: 'Missing Total Time',
  TimeRangeMessage: 'Total time should be More than 0 and less than 180 minutes',
  ConfirmationForLogout: 'Are you sure you want to logout?',
  DriveAdded: 'Drive successfully added',
  ConfirmationForSaveDrive: 'Are you sure you want to save drive?',
  ErrorMessageQuestionCountInsufficient:
    'The question count in the question bank is less than the question count set for this Drive',
  ErrorMessagePaperAlreadyBeingChecked: 'Someone is already checking this paper.',
  UnlockConfirmation: 'Do you want to unlock it?',
  UnsupportedDeviceMessage: 'You must use either desktop or laptop to take this test',
  DoNotHaveAccessOfAnyPage: "You don't have access of any page",
  InternalServerError: 'Internel Server Error',
  CameraAndMicroPhoneNotFound:
    'Please close this window and ensure that your camera or microphone is in working state',
  NetworkIssueMesssage: 'Please check your internet connection, Before starting exam.',
  PlaseContactHr: 'Please contact HR',
  WelcomeOnUserActivity: 'Welcome on UserActivity',
  UserActivityWarningText: 'User-Activity Tab already open on another Tab',
  RolePermissionUpdated: 'permissions have been updated. Please login again.',
  PleaseContactWithHR: 'Please contact the HR for further details.',
  InternetIssueBeforeRegistration: 'Please check your internet connection, Before registration.',
  DeleteQualificationConfirmation: 'Are you sure you want to delete Qualification?',
  DeleteCutoffConfirmation: 'Are you sure you want to delete Cutoff?',
  UpdateMarksConfirmation: 'Are you sure you want to update the marks?',
  YouAreNotAbleToReschedule: 'This action will prevent rescheduling the candidate.',
  UnsavedChanges: 'You have some unsaved changes.',
  CandidateScheduledForFuture:
    'Some candidate are scheduled for future date. Do you want to continue?',
  SessionExpired: 'Your session is expired',
  ScheduleMailConfirmationMessage: 'Are you sure you want to send schedule mail?',
  InterviewResultMailConfirmationMessage: 'Are you sure you want to send interview result mail?',
  CandidateDisqualifiedMail: 'Are you sure you want to send disqualification mail?',
  ScheduleMailConfirmationMessageWithCount:
    'Are you sure you want to send emails to #totalCount candidates?', // don't change the #totalCount key in this message
  DoYouWantToUpdateCandidateResult: 'Do you want to update the result of the candidate?',
  DoYouWantToMarkNotAppeared: 'Do you want to mark candidate status as not appeared?',
  DoYouWantToMarkNotInterested: 'Do you want to mark candidate status as not interested?',
  PleaseCheckYourInternetConnection: 'Please check your internet connection.',
};

export const IconNames = {
  HelpOutline: 'help_outline', // quation mark icon
  ErrorOutline: 'error_outline', // Exclamation mark icon
  CheckCircleOutline: 'check_circle_outline', // correct icon
  HighlightOff: 'highlight_off', // Error Icon
};

export const MessageDialogButtonNames = {
  OK: 'OK',
  YesSubmit: 'Yes, Submit',
  Yes: 'Yes',
  NO: 'NO',
  Delete: 'Delete',
  Update: 'Update',
  SendMail: 'Send Mail',
  YesResetDrive: 'Yes, reset drive',
  YesDeleteIt: 'Yes, delete it',
  YesSchedule: 'Yes, schedule',
  YesReject: 'Yes, reject',
  YesUpdate: 'Yes, update',
  YesLogout: 'Yes, logout',
  YesUnlockIt: 'Yes, unlock it',
  ContinueRegistration: 'Continue Registration',
  CancelRegistration: 'Cancel Registration',
  YesSure: 'Yes, Sure',
  YesSendMail: 'Yes, Send Mail',
  Close: 'Close',
};

export const QuillConfiguration = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean'],
  ],
};

export const MessageDialogTitles = {
  Unauthorized: 'Unauthorized',
  CameraAndMicrophoneNotFound: 'Camera or microphone not found',
  CameraAndMicrophoneIsRequired:
    'Camera and microphone permission are required to continue with the test.',
  NetworkIssue: 'Network Issue',
  Error: 'Error',
  UnsupportedDevice: 'Unsupported device',
  Confirmation: 'Are you sure?',
  Attention: 'Attention',
  ConfirmationForLogout: 'Are you sure you want to logout?',
  ConfirmationForSaveDrive: 'Are you sure you want to save drive?',
  Success: 'Success',
  Welcome: 'WELCOME',
  Warning: 'Warning',
  ActionRequired: 'Action Required',
  InternalServerError: 'Internel Server Error',
  ErrorInRegistration: 'Error in Registration.',
  ErrorMessageCannotResetDrive: 'You cannot reset this Drive',
  Empty: '',
  ErrorMessagePaperAlreadyBeingChecked: 'Someone is already checking this paper.',
  YesLogout: 'Yes, logout!',
  Information: 'Info',
  EmptyField: 'Empty field!!',
  PleaseConfirm: 'Please Confirm',
  IncompleteOperation: 'Incomplete Operation',
};

export const UpdateAreaOfInterest = {
  Checkbox: 'checkbox',
  UpdateAOI: 'updatedAOI',
  ResultStatus: 'resultStatus',
  PreviousFilter: 'previousFilter',
};

export const ScheduleInterviewReport = {
  CommentFeedbackResponse: 'commentFeedbackResponse',
  ExamineeMarksReportResponse: 'examineeMarksReportResponse',
  PaperNameAndMarksBean: 'paperNameAndMarksBean',
};

export const ScheduleMailMenu = {
  Result: 'Result',
  AdvanceSkillTest: 'Advance Skill Test',
  Schedule: 'Schedule',
  FinalOffer: 'Final Offer',
  Joining: 'Joining',
  Disqualified: 'Disqualified',
};

export const SourceConstant = {
  SourceName: 'sourceName',
};

export const OptionConstants = {
  CurrentDate: 'currentDate',
  ByPass: 'byPass',
};

export const AddUserConstants = {
  SelectValidReason: 'Please select a valid reason',
  FillAllDetails: 'Please fill all the details.',
};

export const TimeValidationConstants = {
  Start: 'start',
  End: 'end',
};

export const TemplateConstants = {
  Save: 'save',
};

export const AddPaperConstants = {
  AreaOfInterest: 'areaOfIntererst',
  PaperType: 'paperType',
  PaperName: 'paperName',
  TotalTime: 'totalTime',
  PaperCompilerType: 'paperCompilerType',
};

export const FormTitles = {
  AddAreaOfInterest: 'Add Area Of Interest',
  AreaOfInterest: 'Area Of Interest',
};

export const DATE_FORMAT = 'yyyy-MM-dd';

export const META_KEY_USED = 'MetaKeyUsed';

export const RegistrationTypeOptions = {
  All: 'All',
};

export const ValidationConstant = {
  InvalidDate: 'Invalid driveDate',
  InvalidTime: 'Invalid startTime',
  DriveEligibilityCriteriaCannotBeUpdated: 'Drive Eligibility Criteria cannot be updated',
};
