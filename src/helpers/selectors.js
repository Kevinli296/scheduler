export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const result = [];

  state.days.filter(tmpDay => {
    if (tmpDay.name === day) {
      for (const appointment of tmpDay.appointments) {
        // numbers of appointment index and keys just so happen to match
        result.push(state.appointments[appointment]);
      }
    }
  })
  
  return result;

}

export function getInterviewersForDay(state, day) {
  const result = [];

  state.days.filter(tmpDay => {
    if (tmpDay.name === day) {
      for (const interview of tmpDay.interviewers) {
        result.push(state.interviewers[interview]);
      }
    }
  })

  return result;

}

export function getInterview(state, interview) {
  if (interview !== null) {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
    };
  }

  return null;

}