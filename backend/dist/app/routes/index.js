"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
// import { categoryRouter } from "../modules/category/category.routes";
const upload_routes_1 = require("../modules/upload/upload.routes");
const general_settings_routes_1 = require("../modules/general-settings/general-settings.routes");
const project_routes_1 = require("../modules/project/project.routes");
const task_routes_1 = require("../modules/task/task.routes");
const event_routes_1 = require("../modules/event/event.routes");
const note_routes_1 = require("../modules/note/note.routes");
const team_member_routes_1 = require("../modules/team-member/team-member.routes");
const project_credential_routes_1 = require("../modules/project-credential/project-credential.routes");
const role_routes_1 = require("../modules/role/role.routes");
const collection_routes_1 = require("../modules/collection/collection.routes");
const invoice_routes_1 = require("../modules/invoice/invoice.routes");
const dashboard_routes_1 = require("../modules/dashboard/dashboard.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
  {
    path: "/auth",
    route: auth_routes_1.authRouter,
  },
  // {
  //   path: "/categories",
  //   route: categoryRouter,
  // },
  {
    path: "/projects",
    route: project_routes_1.projectRouter,
  },
  {
    path: "/tasks",
    route: task_routes_1.taskRouter,
  },
  {
    path: "/events",
    route: event_routes_1.eventRouter,
  },
  {
    path: "/notes",
    route: note_routes_1.noteRouter,
  },
  {
    path: "/team-members",
    route: team_member_routes_1.teamMemberRouter,
  },
  {
    path: "/project-credentials",
    route: project_credential_routes_1.projectCredentialRouter,
  },
  {
    path: "/roles",
    route: role_routes_1.roleRouter,
  },
  {
    path: "/collections",
    route: collection_routes_1.collectionRouter,
  },
  {
    path: "/invoices",
    route: invoice_routes_1.invoiceRouter,
  },
  {
    path: "/menu-category",
    route: dashboard_routes_1.dashboardRouter,
  },
  {
    path: "/general-settings",
    route: general_settings_routes_1.generalSettingsRouter,
  },
  {
    path: "/upload",
    route: upload_routes_1.uploadRouter,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
