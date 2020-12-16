import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, getByAltText, getByPlaceholderText, getAllByTestId, prettyDOM } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
xit("renders without crashing", () => {
  render(<Application />);
});

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  // return waitForElement(() => getByText("Monday")) // Promise Chaining
  // .then(() => {
  //   fireEvent.click(getByText("Tuesday"))
  //   // expect(getByText("Leopold Silvers")).toBeInDocument();
  // });
  
  await waitForElement(() => getByText("Monday")); // Async/Await

  fireEvent.click(getByText("Tuesday"));

  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
  const { container } = render(<Application/>)

  await waitForElement(() => getByText(container, "Archie Cohen"));

  // console.log(prettyDOM(container));
  const appointments = getAllByTestId(container, "appointment");
  // console.log(prettyDOM(appointments));
  const appointment = appointments[0];
  // console.log(prettyDOM(appointment));

  fireEvent.click(getByAltText(appointment, "Add"));

  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i),
  {target: { value: "Lydia-Miller Jones"}});

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  fireEvent.click(getByText(appointment, "Save"));

})

})

// Render the Application.
// Wait until the text "Archie Cohen" is displayed.
// Click the "Add" button on the first empty appointment.
// Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
// Click the first interviewer in the list.
// Click the "Save" button on that same appointment.
// Check that the element with the text "Saving" is displayed.
// Wait until the element with the text "Lydia Miller-Jones" is displayed.
// Check that the DayListItem with the text "Monday" also has the text "no spots remaining".