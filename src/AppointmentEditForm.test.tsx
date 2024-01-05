import { render, fireEvent, waitFor, screen, within } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppointmentForm from "./AppointmentForm";

// Mock axios and react-router-dom's useNavigate
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AppointmentForm", () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    // Mock API responses for vendors and buyers
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: "Vendor 1" }],
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: "Buyer 1", company_name: "Company 1" }],
    });
  });

  test("renders form and allows user to submit", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path='/' element={<AppointmentForm />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for vendors and buyers to be loaded
    await waitFor(() => {
      const vendorElement = screen.getByText("Vendor 1");
      expect(vendorElement).toBeInTheDocument();
    });

    await waitFor(() => {
      const buyerSelect = screen.getByTestId("buyer-select");
      const buyerOption = within(buyerSelect).getByText("Buyer 1 - Company 1");
      expect(buyerOption).toBeInTheDocument();
    });

    // Simulate user filling out the form
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Appointment" },
    });
    const vendorSelect = screen.getByTestId(
      "vendor-select"
    ) as HTMLSelectElement;
    fireEvent.change(vendorSelect, {
      target: { value: "1" },
    });

    const buyerSelect = screen.getByTestId("buyer-select") as HTMLSelectElement;
    fireEvent.change(buyerSelect, {
      target: { value: "1" },
    });

    const typeSelect = screen.getByTestId("type-select") as HTMLSelectElement;
    fireEvent.change(typeSelect, {
      target: { value: "physical" },
    });

    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Office" },
    });
    fireEvent.change(screen.getByTestId("start-time"), {
      target: { value: "2024-01-01T10:00" },
    });
    fireEvent.change(screen.getByTestId("end-time"), {
      target: { value: "2024-01-01T11:00" },
    });

    // Mock successful form submission
    mockedAxios.post.mockResolvedValueOnce({ data: "success" });

    // Submit the form
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/appointments`,
        expect.objectContaining({
          title: "New Appointment",
          type: "physical",
          location: "Office",
        })
      );
    });
  });
});
