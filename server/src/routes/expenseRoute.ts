import ExpenseController from '../controllers/ExpenseController';
import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';

const expenseController = new ExpenseController();

export const createExpense = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.createExpense(req);
  res.status(response.code).json(response);
});

export const getAllBeneficiaries = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.getAllBeneficiaries(req);
  res.status(response.code).json(response);
});

export const getAllExpenseTypes = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.getAllExpenseTypes(req);
  res.status(response.code).json(response);
});

export const getAllExpenses = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.getAllExpenses(req);
  res.status(response.code).json(response);
});

export const getAllExpensesById = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.getExpenseById(req);
  res.status(response.code).json(response);
});

export const getAllExpenseCategories = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.getAllExpenseCategories(req);
  res.status(response.code).json(response);
});

export const createBeneficiaryHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.createBeneficiaryHandler(req);
  res.status(response.code).json(response);
});

export const createExpenseTypeHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.createExpenseTypeHandler(req);
  res.status(response.code).json(response);
});

export const createExpenseCategoryHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.createExpenseCategoryHandler(req);
  res.status(response.code).json(response);
});

export const createExpenseHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.createExpense(req);
  res.status(response.code).json(response);
});

export const updateExpenseHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.updateExpense(req);
  res.status(response.code).json(response);
});

export const deleteExpenseHandler = authenticateRouteWrapper(async (req, res) => {
  const response = await expenseController.deleteExpenseById(req);
  res.status(response.code).json(response);
});
