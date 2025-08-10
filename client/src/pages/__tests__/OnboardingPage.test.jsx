import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import OnboardingPage from "../OnboardingPage";
import { vi } from "vitest";

vi.mock("../../hooks/useAuthUser", () => ({
  default: () => ({ authUser: { fullName: "Existing User" } }),
}));

vi.mock("../../config/api", () => ({
  completeOnboarding: vi.fn(async () => ({ success: true })),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
  __esModule: true,
}));

vi.mock("browser-image-compression", () => ({
  __esModule: true,
  default: vi.fn(async (file) => file),
}));

const renderWithProviders = (ui) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("OnboardingPage", () => {
  it("submits onboarding form with provided values", async () => {
    const { completeOnboarding } = await import("../../config/api");
    renderWithProviders(<OnboardingPage />);

    // Fill inputs by placeholder text and roles
    fireEvent.change(screen.getByPlaceholderText(/pls enter your full name/i), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/tell others about yourself/i),
      { target: { value: "Bio here" } }
    );

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "english" } }); // native
    fireEvent.change(selects[1], { target: { value: "spanish" } }); // learning

    fireEvent.change(screen.getByPlaceholderText(/city, country/i), {
      target: { value: "London, UK" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /complete onboarding/i })
    );

    await waitFor(() => expect(completeOnboarding).toHaveBeenCalledTimes(1));
    expect(completeOnboarding).toHaveBeenCalledWith({
      fullName: "Ada Lovelace",
      bio: "Bio here",
      nativeLanguage: "english",
      learningLanguage: "spanish",
      location: "London, UK",
      image: "",
    });
  });
});
