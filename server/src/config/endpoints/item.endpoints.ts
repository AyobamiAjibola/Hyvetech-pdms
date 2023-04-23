import {
    createItemHandler,
    updateItemHandler,
    deleteItemHandler,
    addStockHandler,
    getItemsHandler
} from '../../routes/itemRoute';
import { appCommonTypes } from '../../@types/app-common';
import RouteEndpoints = appCommonTypes.RouteEndpoints;

const itemPath = '/items'
const itemEndpoints: RouteEndpoints = [
    {
        name: 'create item',
        method: 'post',
        path: itemPath,
        handler: createItemHandler,
    },
    {
        name: 'update item',
        method: 'put',
        path: `${itemPath}/:itemId`,
        handler: updateItemHandler,
    },
    {
        name: 'get item',
        method: 'get',
        path: itemPath,
        handler: getItemsHandler,
    },
    {
        name: 'delete item',
        method: 'delete',
        path: `${itemPath}/:itemId`,
        handler: deleteItemHandler,
    },
    {
        name: 'add item stock',
        method: 'patch',
        path: `${itemPath}/stock/:itemId`,
        handler: addStockHandler,
    }
]

export default itemEndpoints