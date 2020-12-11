// function selectUserByName(state, name) {
//   const filteredNames = state.users.filter(user => user.name === name);
//   return filteredNames;
// }

export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const result = [];
  // const selectedDay = state.days.filter(tmpDay => tmpDay.name === day)[0].appointments;

  state.days.filter(tmpDay => {
    if (tmpDay.name === day) {
      for (const appointment of tmpDay.appointments) {
        // numbers of appointment index and keys just so happen to match
        result.push(state.appointments[appointment]);
      }
    }
  })
  
  // console.log(selectedDay);

  // for (const tmp of selectedDay.appointments) {
  //   appointments.push(tmp);
  // }

  // if (selectedDay.length !==)
  // for (const tmp of selectedDay) {
  //   for (const tmp2 in state.appointments) {
  //     if (state.appointments[tmp2].id === tmp) {
  //       result.push(state.appointments[tmp2]);
  //     }
  //   }
  // }
  
  return result;

}

export function getInterviewersForDay() {
  
}

export function getInterview(state, interview) {
  if (interview !== null) {
    return {
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
    }
  }

  return null;

}