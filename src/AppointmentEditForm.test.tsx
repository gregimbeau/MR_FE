import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react";
import axios from "axios";
import AppointmentEditForm from "./AppointmentEditForm";

// Mock axios to prevent actual API calls
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockCloseEditForm = jest.fn();
const mockRefreshAppointments = jest.fn();

const mockAppointment = {
  id: 1,
  title: "Test Appointment",
  type: "virtual",
  location: "Online",
  vendor_id: 1,
  buyer_id: 1,
  start_time: "2024-01-01T10:00",
  end_time: "2024-01-01T11:00",
};

describe("AppointmentEditForm", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: "Vendor 1" }],
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: "Buyer 1", company_name: "Company 1" }],
    });
    window.alert = jest.fn();
    window.scrollTo = jest.fn();
  });

  test("renders form with appointment data", async () => {
    render(
      <AppointmentEditForm
        appointment={mockAppointment}
        closeEditForm={mockCloseEditForm}
        refreshAppointments={mockRefreshAppointments}
      />
    );

    expect(screen.getByDisplayValue("Test Appointment")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Virtual")).toBeInTheDocument();
    });
  });

  test("submits updated appointment", async () => {
    mockedAxios.put.mockResolvedValue({
      data: { message: "Appointment updated successfully!" },
    });

    render(
      <AppointmentEditForm
        appointment={mockAppointment}
        closeEditForm={mockCloseEditForm}
        refreshAppointments={mockRefreshAppointments}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Updated Title" },
    });
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          title: "Updated Title",
        })
      );
    });
  });
});
