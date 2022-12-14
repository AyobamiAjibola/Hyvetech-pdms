import { createContext } from 'react';
import { EstimatePageContextProps } from '@app-interfaces';

const EstimatePageContext = createContext<EstimatePageContextProps | null>(null);

export default EstimatePageContext;
