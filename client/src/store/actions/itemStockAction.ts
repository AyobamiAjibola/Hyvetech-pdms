import asyncThunkWrapper from '../../helpers/asyncThunkWrapper';
import { ApiResponseSuccess } from '@app-interfaces';
import { IItem } from '@app-models';
import settings from '../../config/settings';
import axiosClient from '../../config/axiosClient';

const CREATE_ITEM = 'items:CREATE_ITEM';
const UPDATE_ITEMS = 'items:UPDATE_ITEMS';
const DELETE_ITEM = 'items:DELETE_ITEM';
const GET_ITEMS = 'items:GET_ITEMS';
const ADD_STOCK = 'items:ADD_STOCK';
const API_ROOT = settings.api.rest;

export const createItemAction = asyncThunkWrapper<ApiResponseSuccess<IItem>, any>(
    CREATE_ITEM,
    async args => {
      const response = await axiosClient.post(`${API_ROOT}/items`, args);
      console.log(response)
      return response.data;
    },
);

export const deleteItemAction = asyncThunkWrapper<ApiResponseSuccess<void>, number>(DELETE_ITEM, async id => {
    const response = await axiosClient.delete(`${API_ROOT}/items/${id}`);
    return response.data;
});

export const updateItemAction = asyncThunkWrapper<ApiResponseSuccess<IItem>, any>(
    UPDATE_ITEMS,
    async args => {
      const response = await axiosClient.put(`${API_ROOT}/items/${args.id}`, args);
      return response.data;
    },
);

export const getItemsAction = asyncThunkWrapper<ApiResponseSuccess<IItem>, void>(GET_ITEMS, async () => {
    const response = await axiosClient.get(`${API_ROOT}/items`);
    return response.data;
});

export const addStockAction = asyncThunkWrapper<ApiResponseSuccess<IItem>, any>(
    ADD_STOCK,
    async args => {
      const response = await axiosClient.patch(`${API_ROOT}/items/stock/${args.id}`, args);
      return response.data;
    },
);