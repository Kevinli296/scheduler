import { useState, useEffect } from "react";
import axios from "axios";

export function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  function spotsRemaining(spot) {
    const selectedDay = state.days.find(dayToSelect => {
      return dayToSelect.name === state.day
    });
    return selectedDay.spots += spot;
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const diff = !state.appointments[id].interview ? -1 : 0;
    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(() => {
        spotsRemaining(diff);
        setState({
          ...state,
          appointments
        });
      })

  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        spotsRemaining(1);
        setState({
          ...state,
          appointments
        });
      })

  }

  useEffect(() => {
    const daysURL = `http://localhost:8001/api/days`;
    const appointmentsURL = `http://localhost:8001/api/appointments`;
    const interviewersURL = `http://localhost:8001/api/interviewers`;
    const reset = `http://localhost:8001/api/debug/reset`;
    // UNCOMMENT TO RESET DB
    // axios.get(reset)
    // .then(() => {
    // })
    Promise.all([
      axios.get(daysURL),
      axios.get(appointmentsURL),
      axios.get(interviewersURL)
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, [])

  return { bookInterview, cancelInterview, state, setDay }
}