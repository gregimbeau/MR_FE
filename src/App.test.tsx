import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders ModaResa Appointment System text", () => {
  render(<App />);
  const headerElements = screen.getAllByText(/ModaResa Appointment System/i);
  expect(headerElements.length).toBeGreaterThan(0);
});


