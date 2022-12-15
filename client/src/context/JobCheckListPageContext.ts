import { createContext } from 'react';
import { IJobCheckListPageContextProps } from '@app-interfaces';

const JobCheckListPageContext = createContext<IJobCheckListPageContextProps | null>(null);

export default JobCheckListPageContext;
