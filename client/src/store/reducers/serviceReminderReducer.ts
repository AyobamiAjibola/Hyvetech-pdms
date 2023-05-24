import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';
import { IServiceReminder } from '@app-models';
import { IReminderType } from '@app-models';
import { createReminderAction, createReminderTypeAction, deleteReminderAction, getReminderAction, getReminderTypesAction, resetLastDateAction, toggleReminderStatusAction, updateReminderAction, updateReminderTypeAction } from '../actions/serviceReminderActions';

interface IReminderState {
    createReminderTypeStatus: IThunkAPIStatus;
    createReminderTypeSuccess: string;
    createReminderTypeError?: string;

    updateReminderTypeStatus: IThunkAPIStatus;
    updateReminderTypeSuccess: string;
    updateReminderTypeError?: string;

    getReminderTypesStatus: IThunkAPIStatus;
    getReminderTypesSuccess: string;
    getReminderTypesError?: string;

    createReminderStatus: IThunkAPIStatus;
    createReminderSuccess: string;
    createReminderError?: string;

    updateReminderStatus: IThunkAPIStatus;
    updateReminderSuccess: string;
    updateReminderError?: string;

    getRemindersStatus: IThunkAPIStatus;
    getRemindersSuccess: string;
    getRemindersError?: string;

    deleteReminderStatus: IThunkAPIStatus;
    deleteReminderSuccess: string;
    deleteReminderError?: string;

    toggleReminderStatus: IThunkAPIStatus;
    toggleReminderSuccess: string;
    toggleReminderError?: string;

    reminderTypes: IReminderType[];
    reminderType: IReminderType | null;
    reminders: IServiceReminder[];
    reminder: IServiceReminder | null;
}

const initialState: IReminderState = {
    createReminderTypeStatus: 'idle',
    createReminderTypeSuccess: '',
    createReminderTypeError: '',

    updateReminderTypeStatus: 'idle',
    updateReminderTypeSuccess: '',
    updateReminderTypeError: '',

    getReminderTypesStatus: 'idle',
    getReminderTypesSuccess: '',
    getReminderTypesError: '',

    createReminderStatus: 'idle',
    createReminderSuccess: '',
    createReminderError: '',

    updateReminderStatus: 'idle',
    updateReminderSuccess: '',
    updateReminderError: '',

    getRemindersStatus: 'idle',
    getRemindersSuccess: '',
    getRemindersError: '',

    deleteReminderStatus: 'idle',
    deleteReminderSuccess: '',
    deleteReminderError: '',

    toggleReminderStatus: 'idle',
    toggleReminderSuccess: '',
    toggleReminderError: '',

    reminderTypes: [],
    reminderType: null,
    reminders: [],
    reminder: null
};

const reminderSlice = createSlice({
    name: 'reminder',
    initialState,
    reducers: {
        clearCreateReminderTypeStatus(state: IReminderState) {
            state.createReminderTypeStatus = 'idle';
            state.createReminderTypeSuccess = '';
            state.createReminderTypeError = '';
        },
        clearUpdateReminderTypeStatus(state: IReminderState) {
            state.updateReminderTypeStatus = 'idle';
            state.updateReminderTypeSuccess = '';
            state.updateReminderTypeError = '';
        },
        clearGetReminderTypesStatus(state: IReminderState) {
            state.getReminderTypesStatus = 'idle';
            state.getReminderTypesSuccess = '';
            state.getReminderTypesError = '';
        },
        clearCreateReminderStatus(state: IReminderState) {
            state.createReminderStatus = 'idle';
            state.createReminderSuccess = '';
            state.createReminderError = '';
        },
        clearUpdateReminderStatus(state: IReminderState) {
            state.updateReminderStatus = 'idle';
            state.updateReminderSuccess = '';
            state.updateReminderError = '';
        },
        clearGetRemindersStatus(state: IReminderState) {
            state.getRemindersStatus = 'idle';
            state.getRemindersSuccess = '';
            state.getRemindersError = '';
        },
        clearDeleteReminderStatus(state: IReminderState) {
            state.deleteReminderStatus = 'idle';
            state.deleteReminderSuccess = '';
            state.deleteReminderError = '';
        },
        clearToggleReminderStatus(state: IReminderState) {
            state.toggleReminderStatus = 'idle';
            state.toggleReminderSuccess = '';
            state.toggleReminderError = '';
        },
    },

    extraReducers: builder => {
        builder
            .addCase(createReminderTypeAction.pending, state => {
                state.createReminderTypeStatus = 'loading';
            })
            .addCase(createReminderTypeAction.fulfilled, (state, action) => {
                state.createReminderTypeStatus = 'completed';
                state.createReminderTypeSuccess = action.payload.message;

                state.reminderType = action.payload.result as IReminderType;
            })
            .addCase(createReminderTypeAction.rejected, (state, action) => {
                state.createReminderTypeStatus = 'failed';

                if (action.payload) {
                  state.createReminderTypeError = action.payload.message;
                } else state.createReminderTypeError = action.error.message;
            });

        builder
            .addCase(updateReminderTypeAction.pending, state => {
                state.updateReminderTypeStatus = 'loading';
            })
            .addCase(updateReminderTypeAction.fulfilled, (state, action) => {
                state.updateReminderTypeStatus = 'completed';
                state.updateReminderTypeSuccess = action.payload.message;

                state.reminderType = action.payload.result as IReminderType;
            })
            .addCase(updateReminderTypeAction.rejected, (state, action) => {
                state.updateReminderTypeStatus = 'failed';

                if (action.payload) {
                  state.updateReminderTypeError = action.payload.message;
                } else state.updateReminderTypeError = action.error.message;
            });

        builder
            .addCase(getReminderTypesAction.pending, state => {
                state.getReminderTypesStatus = 'loading';
            })
            .addCase(getReminderTypesAction.fulfilled, (state, action) => {
                state.getReminderTypesStatus = 'completed';
                state.getReminderTypesSuccess = action.payload.message;

                state.reminderTypes = action.payload.results as IReminderType[];
            })
            .addCase(getReminderTypesAction.rejected, (state, action) => {
                state.getReminderTypesStatus = 'failed';

                if (action.payload) {
                  state.getReminderTypesError = action.payload.message;
                } else state.getReminderTypesError = action.error.message;
            });

        builder
            .addCase(createReminderAction.pending, state => {
                state.createReminderStatus = 'loading';
            })
            .addCase(createReminderAction.fulfilled, (state, action) => {
                state.createReminderStatus = 'completed';
                state.createReminderSuccess = action.payload.message;

                state.reminder = action.payload.result as IServiceReminder;
            })
            .addCase(createReminderAction.rejected, (state, action) => {
                state.createReminderStatus = 'failed';

                if (action.payload) {
                  state.createReminderError = action.payload.message;
                } else state.createReminderError = action.error.message;
            });

        builder
            .addCase(updateReminderAction.pending, state => {
                state.updateReminderStatus = 'loading';
            })
            .addCase(updateReminderAction.fulfilled, (state, action) => {
                state.updateReminderStatus = 'completed';
                state.updateReminderSuccess = action.payload.message;

                state.reminder = action.payload.result as IServiceReminder;
            })
            .addCase(updateReminderAction.rejected, (state, action) => {
                state.updateReminderStatus = 'failed';

                if (action.payload) {
                  state.updateReminderError = action.payload.message;
                } else state.updateReminderError = action.error.message;
            });

        builder
            .addCase(resetLastDateAction.pending, state => {
                state.updateReminderStatus = 'loading';
            })
            .addCase(resetLastDateAction.fulfilled, (state, action) => {
                state.updateReminderStatus = 'completed';
                state.updateReminderSuccess = action.payload.message;
            })
            .addCase(resetLastDateAction.rejected, (state, action) => {
                state.updateReminderStatus = 'failed';

                if (action.payload) {
                  state.updateReminderError = action.payload.message;
                } else state.updateReminderError = action.error.message;
            });

        builder
            .addCase(getReminderAction.pending, state => {
                state.getRemindersStatus = 'loading';
            })
            .addCase(getReminderAction.fulfilled, (state, action) => {
                state.getRemindersStatus = 'completed';
                state.getRemindersSuccess = action.payload.message;

                state.reminders = action.payload.results as IServiceReminder[];
            })
            .addCase(getReminderAction.rejected, (state, action) => {
                state.getRemindersStatus = 'failed';

                if (action.payload) {
                  state.getRemindersError = action.payload.message;
                } else state.getRemindersError = action.error.message;
            });

        builder
            .addCase(deleteReminderAction.pending, state => {
                state.deleteReminderStatus = 'loading';
            })
            .addCase(deleteReminderAction.fulfilled, (state, action) => {
                state.deleteReminderStatus = 'completed';
                state.deleteReminderSuccess = action.payload.message;

            })
            .addCase(deleteReminderAction.rejected, (state, action) => {
                state.deleteReminderStatus = 'failed';

                if (action.payload) {
                  state.deleteReminderError = action.payload.message;
                } else state.deleteReminderError = action.error.message;
            });

        builder
            .addCase(toggleReminderStatusAction.pending, state => {
                state.toggleReminderStatus = 'loading';
            })
            .addCase(toggleReminderStatusAction.fulfilled, (state, action) => {
                state.toggleReminderStatus = 'completed';
                state.toggleReminderSuccess = action.payload.message;

                state.reminder = action.payload.result as IServiceReminder;

            })
            .addCase(toggleReminderStatusAction.rejected, (state, action) => {
                state.toggleReminderStatus = 'failed';

                if (action.payload) {
                  state.toggleReminderError = action.payload.message;
                } else state.toggleReminderError = action.error.message;
            });
    }
});

export const {
    clearCreateReminderTypeStatus,
    clearUpdateReminderTypeStatus,
    clearGetRemindersStatus,
    clearDeleteReminderStatus,
    clearToggleReminderStatus,
    clearUpdateReminderStatus,
    clearGetReminderTypesStatus,
    clearCreateReminderStatus

} = reminderSlice.actions;

export default reminderSlice.reducer;