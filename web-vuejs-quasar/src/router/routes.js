import moment from "moment";
import * as timesheetsService from "../services/timesheets.service";
import store from "../store/index";

const verifyAdmin = (req, res, next) => {
  if (isAuthenticated) store.getters.userType == "admin" ? next() : next("/");
  else next("/login");
};

const verifyAdminOrHrDepartments = (req, res, next) => {
  const departments = store.getters.user.departments;
  if (isAuthenticated)
    store.getters.userType == "admin" ||
    departments.some(
      (dep) =>
        dep.name.toLowerCase() === "admin" ||
        dep.name?.toLowerCase() === "human resource",
    )
      ? next()
      : next("/");
  else next("/login");
};

const verifyManager = (req, res, next) => {
  if (isAuthenticated)
    store.getters.userType == "manager" || store.getters.userType == "admin"
      ? next()
      : next("/");
  else next("/login");
};

const verifyMentor = (req, res, next) => {
  if (isAuthenticated)
    store.getters.userType == "mentor" ||
    store.getters.userType == "manager" ||
    store.getters.userType == "admin"
      ? next()
      : next("/");
  else next("/login");
};

const verifyUser = (req, res, next) => {
  if (isAuthenticated)
    store.getters.userType == "user" ||
    store.getters.userType == "mentor" ||
    store.getters.userType == "manager" ||
    store.getters.userType == "admin"
      ? next()
      : next("/login");
  else next("/login");
};

const verifyLoanUser = async (req, res, next) => {
  if (isAuthenticated) {
    const givenDate = moment(store.getters.user.dates.dateOfJoin);
    const res = await timesheetsService.getServerDate();
    const today = moment(res.data);
    store.getters.user.grade.toString() !== "G1" &&
    today.diff(givenDate, "months") >= 6
      ? next()
      : next("/");
  } else next("/login");
};

const isAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    return true;
  }
  return false;
};

const isNotAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    return next("/");
  }
  return next();
};

const routes = [
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
    beforeEnter: isNotAuthenticated,
  },
  {
    path: "/",
    component: () => import("pages/Dashboard.vue"),
    beforeEnter: verifyUser,
    meta: {
      title: "Dashboard",
    },
  },
  {
    path: "/profile/" + store.getters.userId,
    component: () => import("pages/Profile.vue"),
    meta: {
      title: "Profile",
    },
  },
  {
    path: "/users",
    component: () => import("pages/EmployeeDetails.vue"),
    beforeEnter: verifyManager,
    meta: {
      title: "Employee Details",
    },
  },
  {
    path: "/events",
    component: () => import("pages/AddEvents.vue"),
    beforeEnter: verifyAdminOrHrDepartments,
    meta: {
      title: "Events",
    },
  },
  {
    path: "/skills",
    component: () => import("pages/Skills.vue"),
    beforeEnter: verifyAdmin,
    meta: {
      title: "Skills",
    },
  },
  {
    path: "/daily-reports",
    component: () => import("pages/TimeSheets.vue"),
    beforeEnter: verifyUser,
    meta: {
      title: "Daily Report",
    },
  },
  {
    path: "/leaves",
    component: () => import("pages/Leaves.vue"),
    beforeEnter: verifyUser,
    meta: {
      title: "Leaves",
    },
  },
  {
    path: "/appraisal",
    component: () => import("pages/Appraisal.vue"),
    beforeEnter: verifyUser,
    meta: {
      title: "Appraisal",
    },
  },
  {
    path: "/clients",
    component: () => import("pages/Teams.vue"),
    beforeEnter: verifyManager,
    meta: {
      title: "Clients",
    },
  },
  {
    path: "/internetreimbursement",
    component: () => import("pages/InternetReimbursement.vue"),
    beforeEnter: verifyUser,
    meta: {
      title: "Internet Reimbursement",
    },
  },
  {
    path: "/forgotpassword",
    component: () => import("pages/Forgot.vue"),
    beforeEnter: isNotAuthenticated,
  },
  {
    path: "/resetpassword",
    component: () => import("pages/ResetPassword.vue"),
  },
  {
    path: "/inboxpage",
    component: () => import("pages/InboxView.vue"),
    beforeEnter: verifyUser,
    meta: {
      title: "InboxView",
    },
  },
  {
    path: "/userSettlement",
    component: () => import("pages/Settlement.vue"),
    beforeEnter: verifyUser,
    meta: {
      title: "Settlement",
    },
  },
  {
    path: "/salarystruct",
    component: () => import("pages/SalaryStructure"),
    beforeEnter: verifyAdmin,
    meta: {
      title: "Salary Structure",
    },
  },
  {
    path: "/crons",
    component: () => import("pages/cronDashboard"),
    beforeEnter: verifyAdmin,
    meta: {
      title: "Cron Dashboard",
    },
  },
  {
    path: "/payroll",
    component: () => import("pages/Payroll"),
    beforeEnter: verifyAdmin,
    meta: {
      title: "Payroll",
    },
  },
  {
    path: "/inventories",
    component: () => import("pages/Inventories"),
    beforeEnter: verifyAdmin,
    meta: {
      title: "Inventories",
    },
  },
  {
    path: "/loan",
    component: () => import("pages/Loan"),
    beforeEnter: verifyLoanUser,
    meta: {
      title: "Loan",
    },
  },
  {
    path: "/mediclaims",
    component: () => import("pages/Mediclaims"),
    beforeEnter: verifyUser,
    meta: {
      title: "Mediclaim",
    },
  },
  {
    path: "/petty-cash",
    component: () => import("pages/PettyCash.vue"),
    beforeEnter: verifyAdminOrHrDepartments,
    meta: {
      title: "Petty Cash",
    },
  },
];

export default routes;
