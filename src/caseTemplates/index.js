import { dailyLostJobCreditTemplate } from "./dailyLostJobCreditTemplate.js";
import { dailyTonyMultiDatingTemplate } from "./dailyTonyMultiDatingTemplate.js";
import { dailyFakeProfileTemplate } from "./dailyFakeProfileTemplate.js";
import { dailyWorkplaceReimbursementTemplate } from "./dailyWorkplaceReimbursementTemplate.js";

export const DAILY_TEMPLATE_BUILDERS = {
  "lost-job-hidden-credit": dailyLostJobCreditTemplate,
  "tony-multi-dating": dailyTonyMultiDatingTemplate,
  "education-income-fake-profile": dailyFakeProfileTemplate,
  "workplace-reimbursement-screenshot": dailyWorkplaceReimbursementTemplate
};
