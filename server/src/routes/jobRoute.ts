import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import JobController from '../controllers/JobController';

export const getJobsHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.jobs();
  res.status(response.code).json(response);
});

export const getJobHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.job(req);
  res.status(response.code).json(response);
});

export const assignDriverJobHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.assignDriverJob(req);
  res.status(response.code).json(response);
});

export const assignCustomerJobHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.assignCustomerJob(req);
  res.status(response.code).json(response);
});

export const assignJobHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.assignJob(req);
  res.status(response.code).json(response);
});

export const reassignJobHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.reassignJob(req);
  res.status(response.code).json(response);
});

export const cancelJobHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.cancelJob(req);
  res.status(response.code).json(response);
});

export const approveJobCheckListHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.approveJobCheckList(req);
  res.status(response.code).json(response);
});

export const updateJobVehicleHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.updateJobVehicle(req);
  res.status(response.code).json(response);
});

export const uploadJobReportHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.uploadJobReport(req);
  res.status(response.code).json(response);
});
