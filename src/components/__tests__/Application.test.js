import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, getByAltText, getByPlaceholderText, getAllByTestId, queryByText, queryByAltText, prettyDOM } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  // 1. Wait until the element "Monday" is displayed.
  await waitForElement(() => getByText("Monday")); // Async/Await

  // 2. Click on "Tuesday" from the Day list.
  fireEvent.click(getByText("Tuesday"));

  // 3. Check that the name "Leopold Silvers" is displayed.
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
  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();

});

it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  // 1. Render the Application.
  const { container, debug } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );

  // 3. Click the "Delete" button on the booked appointment.
  fireEvent.click(queryByAltText(appointment, "Delete"));

  // 4. Check that the element with the confirmation message is shown.
  expect(getByText(appointment, /Are you sure you would like to delete?/i));

  // 5. Click the "Confirm" button on the confirmation.
  fireEvent.click(queryByText(appointment, "Confirm"));

  // 6. Check that the element with the text "Deleting" is displayed.
  expect(getByText(appointment, "Deleting")).toBeInTheDocument();

  // 7. Wait until the element with the "Add" button is displayed.
  await waitForElement(() => getByAltText(appointment, "Add"));

  // 8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining" (Because the previous test decreases the spots by 1).
  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
});

it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  // 1. Render the Application.
  const { container, debug } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );

  // 3. Click the "Edit" button on the booked appointment.
  fireEvent.click(queryByAltText(appointment, "Edit"));

  // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i),
  {target: {value: "Lydia Miller-Jones"}});

  // 5. Click the first interviewer in the list.
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // 6. Click the "Save" button on that same appointment.
  fireEvent.click(getByText(appointment, "Save"));

  // 7. Check that the element with the text "Saving" is displayed.
  expect(getByText(appointment, "Saving"));

  // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  // 9. Check that the DayListItem with the text "Monday" also has the same amount of spots remaining.
  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

});

it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application/>)

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
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
    
    // 8. Wait until the element with the error message is displayed.
    await waitForElement(() => expect(getByText(appointment, /Could not save appointment./i)));

    // 9. Check that the element with the error message is displayed.
    expect(getByText(appointment, /Could not save appointment./i)).toBeInTheDocument();

    // 10. Click the "Close" button on the error.
    fireEvent.click(getByAltText(appointment, "Close"));

    // 11.  Wait until the placeholder text is displayed.
    await waitForElement(() => expect(getByPlaceholderText(appointment, /enter student name/i)));

    // 12. Check that the placeholder text is displayed.
    expect(getByPlaceholderText(appointment, /enter student name/i));

});

it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(queryByAltText(appointment, "Delete"));
  
    // 4. Check that the element with the confirmation message is shown.
    expect(getByText(appointment, /Are you sure you would like to delete?/i));
  
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the error message is displayed.
    await waitForElement(() => expect(getByText(appointment, /Could not delete appointment./i)));

    // 8. Check that the element with the error message is displayed.
    expect(getByText(appointment, /Could not delete appointment./i)).toBeInTheDocument();

    // 9. Click the "Close" button on the error.
    fireEvent.click(getByAltText(appointment, "Close"));

    // 10. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => expect(getByText(appointment, "Archie Cohen")));

    // 11. Check that the text "Archie Cohen" is displayed.
    expect(getByText(appointment, "Archie Cohen"));

});

})