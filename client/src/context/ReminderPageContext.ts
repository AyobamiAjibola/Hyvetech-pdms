import { createContext } from 'react';
import { ReminderPageContextProps } from '@app-interfaces';

const ReminderPageContext = createContext<ReminderPageContextProps | null>(null);

export default ReminderPageContext;