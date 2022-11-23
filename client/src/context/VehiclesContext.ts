import { createContext } from 'react';
import { DriverVehiclesContextProps } from '@app-interfaces';

const VehiclesContext = createContext<DriverVehiclesContextProps | null>(null);

export default VehiclesContext;
