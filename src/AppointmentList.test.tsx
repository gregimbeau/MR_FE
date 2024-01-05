import { render, screen, waitFor } from "@testing-library/react";
import AppointmentList from "./AppointmentList";
import axios from "axios";

test("renders loading state initially", () => {
  render(<AppointmentList />);
  const loadingText = screen.getByText("Loading...");
  expect(loadingText).toBeInTheDocument();
});

test("renders appointments when data is fetched", async () => {
  // Mock the axios.get function to return sample data
  jest
    .spyOn(axios, "get")
    .mockResolvedValue({ data: [{ id: 1, title: "Test Appointment 1" }] });

  render(<AppointmentList />);

  // Wait for loading to disappear
  await waitFor(() => {
    const loadingText = screen.queryByText("Loading...");
    expect(loadingText).toBeNull();
  });

  // Now, check for the rendered appointment
  const appointmentText = screen.getByText("Test Appointment 1");
  expect(appointmentText).toBeInTheDocument();
});
