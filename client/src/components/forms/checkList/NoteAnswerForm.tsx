import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { CheckListQuestionType } from '@app-types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  Paper,
  Popper,
  TextField,
} from '@mui/material';
import { CssVarsProvider, Radio, RadioGroup, Sheet } from '@mui/joy';
import CustomRadioIconField from '../fields/CustomRadioIconField';
import { CameraAlt, CheckCircleRounded, Close } from '@mui/icons-material';
import { JobCheckListPageContext } from '../../../pages/checkList/JobCheckListPage';
import { IJobCheckListPageContextProps } from '@app-interfaces';

const COLORS = ['#E14B5A', '#F2994A', '#009A49', '#E6E6E6'];

interface FormProps {
  onChangeTextArea: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  question: CheckListQuestionType;
  onChangeRadioBtn: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeImage: (e: ChangeEvent<HTMLInputElement>, questionId?: any) => void;
  onRemoveImage: (id: any, questionId?: any) => void;
}

export default function NoteAnswerForm(props: FormProps) {
  const [openNote, setOpenNote] = useState<boolean>(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(openNote);

  const { question } = props;

  const { imageRef } = useContext(JobCheckListPageContext) as IJobCheckListPageContextProps;

  useEffect(() => {
    if (prevOpen.current && !openNote) {
      anchorRef.current?.focus();
    }

    prevOpen.current = openNote;
  }, [openNote]);

  const handleToggle = () => {
    setOpenNote(prevOpen => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;

    setOpenNote(false);
  };

  return (
    <Card sx={{ width: '100%' }} variant="outlined">
      <CardHeader title={question.question} />
      <CardContent>
        <CssVarsProvider>
          <RadioGroup name="answer" size="lg" sx={{ gap: 1.5 }}>
            {question.answers.map((answer, idx2) => {
              const weight = Math.floor(+answer.weight);
              const bgColor = answer.color ? answer.color : COLORS[weight];

              return (
                <Sheet key={idx2} sx={{ p: 2, borderRadius: 'md' }}>
                  <Radio
                    component={props1 => <Button {...props1} />}
                    label={answer.answer}
                    overlay
                    disableIcon
                    id={answer.id}
                    value={answer.id}
                    checked={answer.selected}
                    onChange={props.onChangeRadioBtn}
                    componentsProps={{
                      label: (checked: boolean) => ({
                        sx: {
                          fontWeight: 'lg',
                          fontSize: 'md',
                          color: checked ? 'text.primary' : 'text.secondary',
                        },
                      }),
                      action: (checked: any) => ({
                        sx: () => ({
                          ...(checked && {
                            '--variant-borderWidth': '1px',
                            '&&': {
                              // && to increase the specificity to win the base :hover styles
                              // borderColor: theme.vars.palette.primary[500],
                              backgroundColor: bgColor,
                            },
                          }),
                        }),
                      }),
                    }}
                  />
                </Sheet>
              );
            })}
          </RadioGroup>
        </CssVarsProvider>
      </CardContent>
      {question.images ? (
        <CardContent sx={{ overflowX: 'scroll' }}>
          <CustomRadioIconField questionId={question.id} options={question.images} onDelete={props.onRemoveImage} />
        </CardContent>
      ) : null}
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {question.note && (
          <React.Fragment>
            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={openNote ? 'composition-menu' : undefined}
              aria-expanded={openNote ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              sx={{ textTransform: 'capitalize' }}>
              add note..
            </Button>
            <Popper
              open={openNote}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              sx={{ width: '100%', maxWidth: 440, zIndex: 999 }}>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}>
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <Card>
                        <CardActions
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <IconButton onClick={handleClose}>
                            <Close />
                          </IconButton>
                          <IconButton onClick={handleClose}>
                            <CheckCircleRounded />
                          </IconButton>
                        </CardActions>
                        <Divider flexItem orientation="horizontal" />
                        <CardContent>
                          <TextField
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={5}
                            name={question.id}
                            id={question.id}
                            value={question.text}
                            onChange={props.onChangeTextArea}
                          />
                        </CardContent>
                      </Card>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </React.Fragment>
        )}
        {question.media && (
          <Button component="label" sx={{ textTransform: 'capitalize' }} startIcon={<CameraAlt />}>
            media
            <input
              onChange={e => props.onChangeImage(e, question.id)}
              hidden
              ref={imageRef}
              id={question.id}
              accept="image/*"
              type="file"
            />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
