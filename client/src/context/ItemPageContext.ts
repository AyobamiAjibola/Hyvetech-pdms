import { createContext } from 'react';
import { ItemPageContextProps } from '@app-interfaces';

const ItemPageContext = createContext<ItemPageContextProps | null>(null);

export default ItemPageContext;