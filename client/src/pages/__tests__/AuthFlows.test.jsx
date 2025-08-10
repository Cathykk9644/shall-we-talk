import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import LoginPage from "../LoginPage";
import SignUpPage from "../SignUpPage";
import { vi } from "vitest";

vi.mock("../../config/api", () => ({
  login: vi.fn(async () => ({ success: true })),
  signup: vi.fn(async () => ({ success: true })),
}));

const renderWithProviders = (ui) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Auth flows", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits login form with email and password", async () => {
    const { login } = await import("../../config/api");
    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/stevejobs@apple.com/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*/), {
      target: { value: "secret" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    expect(login).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "secret",
    });
  });

  it("shows error message on failed login", async () => {
    const { login } = await import("../../config/api");
    login.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/stevejobs@apple.com/i), {
      target: { value: "bad@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*/i), {
      target: { value: "wrong" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("submits signup form with full name, email and password", async () => {
    const { signup } = await import("../../config/api");
    renderWithProviders(<SignUpPage />);

    fireEvent.change(screen.getByPlaceholderText(/steve jobs/i), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByPlaceholderText(/stevejobs@apple.com/i), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\*\*\*\*\*\*\*\*\*\*/i), {
      target: { value: "pass1234" },
    });

    // Accept terms checkbox
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(signup).toHaveBeenCalledTimes(1));
    expect(signup).toHaveBeenCalledWith({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "pass1234",
    });
  });
});
