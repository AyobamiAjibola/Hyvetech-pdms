import authenticateRouteWrapper from '../middleware/authenticateRouteWrapper';
import ItemStockController from '../controllers/ItemStockController';

const itemStockController = new ItemStockController();

export const createItemHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await itemStockController.create(req);
    res.status(response.code).json(response);
});

export const deleteItemHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await itemStockController.delete(req);
    res.status(response.code).json(response);
});

export const updateItemHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await itemStockController.update(req);
    res.status(response.code).json(response);
});

export const getItemsHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await itemStockController.items(req);
    res.status(response.code).json(response);
});

export const addStockHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await itemStockController.addStock(req);
    res.status(response.code).json(response);
});

export const updateStatusHandler = authenticateRouteWrapper(async (req, res) => {
    const response = await itemStockController.updateItemStatus(req);
    res.status(response.code).json(response);
});