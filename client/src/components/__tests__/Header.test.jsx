import { render, screen } from "@testing-library/react";
import React from "react";
import Header from "../Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

vi.mock("../../hooks/useAuthUser", () => ({
  default: () => ({ authUser: undefined, isLoading: false }),
}));

vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useNavigate: () => vi.fn(),
  Link: ({ children }) => <a>{children}</a>,
}));

describe("Header", () => {
  const renderWithClient = (ui) => {
    const client = new QueryClient();
    return render(
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    );
  };

  it("shows Login and Signup when no auth user", () => {
    renderWithClient(<Header />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });
});
