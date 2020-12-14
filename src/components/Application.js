import React, { useState, useEffect } from "react";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import axios from "axios";

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";
import { useApplicationData } from "../hooks/useApplicationData";

import "components/Application.scss";

export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    spotsRemaining
  } = useApplicationData();

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  // console.log(dailyAppointments);
  // console.log(dailyInterviewers);

  // const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

//   function editInterview(id, interview) {
//     const appointment = {
//       ...state.appointments[id],
//       interview: {...interview}
//     }

//     const appointments = {
//       ...state.appointments,
//       [id]: interview
//     }

//     return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
//     .then(() => {
//       setState({
//         ...state,
//         appointments
//     });
//   })

// }

  const appointmentsList = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      // <Appointment
      //   key={appointment.id}
      //   time={appointment.time}
      //   interview={appointment.interview}
      // />
      <Appointment {...appointment} key={appointment.id} interviewers={dailyInterviewers} interview={interview} bookInterview={bookInterview} cancelInterview={cancelInterview} />
    );
  })

  return (

    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsList}
        <Appointment key="last" time="5pm" />
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
      </section>
    </main>
  );
}