import React from "react";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import { useVisualMode } from "../../hooks/useVisualMode";
import { getInterviewersForDay } from "../../helpers/selectors";

import "components/Appointment/styles.scss";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVING = "ERROR_SAVING";
  const ERROR_DELETING = "ERROR_DELETING";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVING, true));
  }

  function initialCancel() {
    transition(CONFIRM);
  }

  function confirmedCancel() {

    transition(DELETING);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETING, true));
  }

  // FOR DOUBLE BACK
  // function destroy(event) {
  //   transition(DELETING, true);
  //   props
  //    .cancelInterview(props.id)
  //    .then(() => transition(EMPTY))
  //    .catch(error => transition(ERROR_DELETE, true));
  //  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={!false && props.interview.student}
          interviewer={!false && props.interview.interviewer}
          onCancel={initialCancel}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer.id}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status
          message={"Saving"}
        />
      )}
      {mode === ERROR_SAVING && (
        <Error
          message={"Could not save appointment."}
          onClose={() => back()}
        />
      )}
      {mode === DELETING && (
        <Status
          message={"Deleting"}
        />
      )}
      {mode === ERROR_DELETING && (
        <Error
          message={"Could not delete appointment."}
          onClose={() => back()}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onConfirm={confirmedCancel}
          onCancel={() => back()}
        />
      )}
      {
        // props.interview ?
        // <Show student={props.interview.student} interviewer={props.interview.interviewer} /> :
        // <Empty />
      }
    </article>
  )

}