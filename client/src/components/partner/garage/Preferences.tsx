import { Divider, Grid, Typography } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import AppAlert from '../../alerts/AppAlert';
import { LoadingButton } from '@mui/lab';
import { getPreferencesActions, updatePreferencesAction } from '../../../store/actions/partnerActions';
import { clearUpdatePreferenceStatus } from '../../../store/reducers/partnerReducer';
import { Update } from '@mui/icons-material';

const Preferences = () => {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const dispatch = useAppDispatch();

  const [alerMessage, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(
    null,
  );

  const store = useAppSelector(state => state.partnerReducer);

  useEffect(() => {
    if (store.preference) {
      setEditorState(EditorState.createWithContent(stateFromHTML(store.preference.termsAndCondition || '')));
    }
  }, [store.preference]);

  const getPreferences = useCallback(() => {
    dispatch(getPreferencesActions({}));
  }, []);

  useEffect(() => {
    getPreferences();
  }, []);

  useEffect(() => {
    if (store.updatePreferenceStatus === 'completed') {
      setAlert({ type: 'success', message: 'Preferences updated successfully' });
      getPreferences();
      dispatch(clearUpdatePreferenceStatus());
    } else if (store.updatePreferenceStatus === 'failed') {
      setAlert({ type: 'error', message: store.updatePreferenceError || '' });
    }
  }, [store.updatePreferenceStatus]);

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  const handleUpdatePreference = () => {
    const html = stateToHTML(editorState.getCurrentContent());

    dispatch(updatePreferencesAction({ termsAndCondition: html }));
  };
  return (
    <div>
      <Grid container>
        <Grid item sm={12} xs={12}>
          <Typography>Terms and Conditions</Typography>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onEditorStateChange}
          />
        </Grid>
      </Grid>

      <Divider style={{ marginTop: 20, marginBottom: 20 }} />
      <LoadingButton
        type="submit"
        loading={store.updatePreferenceStatus === 'loading'}
        disabled={store.updatePreferenceStatus === 'loading'}
        // disabled={
        //   saveStatus || values.status === ESTIMATE_STATUS.sent || values.status === ESTIMATE_STATUS.invoiced
        // }
        onClick={handleUpdatePreference}
        variant="contained"
        color="secondary"
        endIcon={<Update />}>
        {'Update'}
      </LoadingButton>

      <AppAlert
        onClose={() => setAlert(null)}
        alertType={alerMessage?.type || 'info'}
        show={alerMessage !== null}
        message={alerMessage?.message}
      />
    </div>
  );
};

export default Preferences;
