import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Header from "../Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

vi.mock("../../hooks/useAuthUser", () => ({
  default: () => ({
    authUser: {
      fullName: "John Smith",
      isOnboarded: true,
      profilePic: "",
    },
    isLoading: false,
  }),
}));

vi.mock("../../config/api", () => ({
  logout: vi.fn(async () => ({ success: true })),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children }) => <a>{children}</a>,
  };
});

const renderWithClient = (ui) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Header (logged-in)", () => {
  it("opens logout modal and confirms logout", async () => {
    const { logout } = await import("../../config/api");
    renderWithClient(<Header />);

    // The logout button is the one with title "Logout"
    fireEvent.click(screen.getByTitle(/logout/i));
    expect(await screen.findByText(/confirm logout/i)).toBeInTheDocument();

    // Cancel closes modal
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() =>
      expect(screen.queryByText(/confirm logout/i)).not.toBeInTheDocument()
    );

    // Open again and confirm
    fireEvent.click(screen.getByTitle(/logout/i));
    fireEvent.click(await screen.findByRole("button", { name: /log out/i }));

    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
  });
});
