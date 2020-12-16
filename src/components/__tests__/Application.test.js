import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, getByAltText, getByPlaceholderText, getAllByTestId, queryByText, prettyDOM } from "@testing-library/react";

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
  // 1. Render the Application.
  const { container, debug } = render(<Application/>)

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // console.log(prettyDOM(container));
  const appointments = getAllByTestId(container, "appointment");
  // console.log(prettyDOM(appointments));
  const appointment = appointments[0];
  // console.log(prettyDOM(appointment));
  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );
  // console.log(prettyDOM(day));

  // 3. Click the "Add" button on the first empty appointment.
  fireEvent.click(getByAltText(appointment, "Add"));

  // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i),
  {target: { value: "Lydia Miller-Jones"}});

  // 5. Click the first interviewer in the list.
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // 6. Click the "Save" button on that same appointment.
  fireEvent.click(getByText(appointment, "Save"));

  // 7. Check that the element with the text "Saving" is displayed.
  expect(getByText(appointment, "Saving")).toBeInTheDocument();

  // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
  await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

  // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
  expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
});

})