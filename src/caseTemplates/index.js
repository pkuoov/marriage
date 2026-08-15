import { dailyLostJobCreditTemplate } from "./dailyLostJobCreditTemplate.js";
import { dailyHouseBoundaryTemplate } from "./dailyHouseBoundaryTemplate.js";
import { dailyTonyMultiDatingTemplate } from "./dailyTonyMultiDatingTemplate.js";
import { dailyFakeProfileTemplate } from "./dailyFakeProfileTemplate.js";
import { dailyWorkplaceReimbursementTemplate } from "./dailyWorkplaceReimbursementTemplate.js";

export const DAILY_TEMPLATE_BUILDERS = {
  "lost-job-hidden-credit": dailyLostJobCreditTemplate,
  "house-name-security-test": dailyHouseBoundaryTemplate,
  "tony-multi-dating": dailyTonyMultiDatingTemplate,
  "education-income-fake-profile": dailyFakeProfileTemplate,
  "workplace-reimbursement-screenshot": dailyWorkplaceReimbursementTemplate
};
