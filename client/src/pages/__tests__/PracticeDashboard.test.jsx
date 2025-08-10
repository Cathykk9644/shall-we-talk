import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import PracticeDashboard from "../PracticeDashboard";
import { vi } from "vitest";

const renderWithProviders = (ui) => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

vi.mock("../../components/FriendCard", () => ({
  __esModule: true,
  default: ({ friend }) => <div>Friend: {friend.fullName}</div>,
  getLanguageFlag: () => null,
}));

vi.mock("../../config/api", () => ({
  getUserFriends: vi.fn(async () => []),
  getRecommendedUsers: vi.fn(async () => ({
    totalUsers: 7,
    recommendedUsers: [
      {
        _id: "u1",
        fullName: "Alice",
        nativeLanguage: "english",
        learningLanguage: "spanish",
        profilePic: "",
        bio: "Hello",
        location: "NY",
      },
      {
        _id: "u2",
        fullName: "Bob",
        nativeLanguage: "spanish",
        learningLanguage: "english",
        profilePic: "",
        bio: "Hi",
        location: "LA",
      },
      {
        _id: "u3",
        fullName: "Cara",
        nativeLanguage: "french",
        learningLanguage: "english",
        profilePic: "",
        bio: "Hey",
        location: "Paris",
      },
      {
        _id: "u4",
        fullName: "Dan",
        nativeLanguage: "german",
        learningLanguage: "spanish",
        profilePic: "",
        bio: "",
        location: "Berlin",
      },
      {
        _id: "u5",
        fullName: "Eve",
        nativeLanguage: "english",
        learningLanguage: "german",
        profilePic: "",
        bio: "",
        location: "SF",
      },
      {
        _id: "u6",
        fullName: "Finn",
        nativeLanguage: "spanish",
        learningLanguage: "french",
        profilePic: "",
        bio: "",
        location: "Madrid",
      },
    ],
  })),
  getOutgoingFriendReqs: vi.fn(async () => [{ recipient: { _id: "u2" } }]),
  sendFriendRequest: vi.fn(async () => ({ success: true })),
  getFriendRequests: vi.fn(async () => ({ incomingReqs: [{ _id: "r1" }] })),
}));

describe("PracticeDashboard", () => {
  it("renders recommendations, shows badge, and sends a friend request", async () => {
    const { sendFriendRequest } = await import("../../config/api");
    renderWithProviders(<PracticeDashboard />);

    // Find Language Partners header renders
    expect(
      await screen.findByText(/find language partners/i)
    ).toBeInTheDocument();

    // Friend requests badge shown with count 1
    expect(screen.getByText("Friend Requests")).toBeInTheDocument();

    // Recommended users rendered (first page shows 6)
    expect(await screen.findByText(/Alice/)).toBeInTheDocument();

    // u2 has outgoing request -> button should be disabled and say Request Sent
    const requestSentBtn = screen.getAllByRole("button", {
      name: /request sent/i,
    })[0];
    expect(requestSentBtn).toBeDisabled();

    // Send request for u1
    const sendButtons = screen.getAllByRole("button", {
      name: /send friend request/i,
    });
    fireEvent.click(sendButtons[0]);
    await waitFor(() => expect(sendFriendRequest).toHaveBeenCalledWith("u1"));
  });

  it("paginates to next page when next button clicked", async () => {
    const { getRecommendedUsers } = await import("../../config/api");
    renderWithProviders(<PracticeDashboard />);

    // Wait for recommendations to load so totalUsers is set and button state updates
    await screen.findByText(/Alice/);

    const nextBtn = screen.getByRole("button", { name: "»" });
    await waitFor(() => expect(nextBtn).toBeEnabled());

    fireEvent.click(nextBtn);

    await waitFor(() =>
      expect(getRecommendedUsers).toHaveBeenCalledWith(2, 6, "")
    );
  });
});
