import authenticateRouteWrapper from "../middleware/authenticateRouteWrapper";
import JobController from "../controllers/JobController";

export const getJobsHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await JobController.jobs();
  res.status(response.code).json(response);
});

export const assignDriverJobHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await JobController.assignDriverJob(req);
    res.status(response.code).json(response);
  }
);

export const assignCustomerJobHandler = authenticateRouteWrapper(
  async (req, res) => {
    const response = await JobController.assignCustomerJob(req);
    res.status(response.code).json(response);
  }
);
