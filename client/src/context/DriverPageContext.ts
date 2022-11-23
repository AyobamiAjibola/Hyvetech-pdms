import { createContext } from 'react';
import { DriverPageContextProps } from '@app-interfaces';

const DriverPageContext = createContext<DriverPageContextProps | null>(null);

export default DriverPageContext;
