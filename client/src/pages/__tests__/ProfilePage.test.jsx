import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import ProfilePage from "../ProfilePage";
import { vi } from "vitest";

const renderWithProviders = (ui) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

vi.mock("../../config/api", () => ({
  getUserProfile: vi.fn(async () => ({
    fullName: "Jane Doe",
    bio: "Hello",
    nativeLanguage: "english",
    learningLanguage: "spanish",
    profilePic: "http://example.com/pic.jpg",
    location: "NY, USA",
  })),
  updateUserProfile: vi.fn(async (data) => data),
  deleteUserAccount: vi.fn(async () => ({ success: true })),
}));

// Simplify the imported flag rendering to avoid network requests
vi.mock("../../components/FriendCard", () => ({
  __esModule: true,
  default: () => null,
  getLanguageFlag: () => null,
}));

describe("ProfilePage", () => {
  it("edits and saves a field (Name)", async () => {
    const { updateUserProfile } = await import("../../config/api");
    renderWithProviders(<ProfilePage />);

    // Wait for data load
    expect(await screen.findByText(/my profile/i)).toBeInTheDocument();

    // Enter edit mode for Name
    fireEvent.click(screen.getByRole("button", { name: /edit name/i }));
    const nameInput = screen.getByRole("textbox");
    fireEvent.change(nameInput, { target: { value: "Jane A. Doe" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(updateUserProfile).toHaveBeenCalledWith({
        fullName: "Jane A. Doe",
      })
    );
  });

  it("opens and cancels delete modal", async () => {
    renderWithProviders(<ProfilePage />);

    expect(await screen.findByText(/my profile/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));
    expect(screen.getByText(/confirm account deletion/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    await waitFor(() =>
      expect(
        screen.queryByText(/confirm account deletion/i)
      ).not.toBeInTheDocument()
    );
  });
});
