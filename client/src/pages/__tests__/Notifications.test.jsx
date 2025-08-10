import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import NotificationPage from "../NotificationPage";
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
  getFriendRequests: vi.fn(async () => ({
    incomingReqs: [
      {
        _id: "req1",
        sender: {
          fullName: "John Doe",
          profilePic: "http://example.com/pic.jpg",
          nativeLanguage: "english",
          learningLanguage: "spanish",
        },
      },
    ],
    acceptedReqs: [],
  })),
  acceptFriendRequest: vi.fn(async () => ({ success: true })),
}));

describe("NotificationPage", () => {
  it("lists incoming requests and accepts one", async () => {
    const { acceptFriendRequest } = await import("../../config/api");
    renderWithProviders(<NotificationPage />);

    // Shows section with badge count
    expect(await screen.findByText(/friend requests/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();

    // Click Accept
    fireEvent.click(screen.getByRole("button", { name: /accept/i }));

    await waitFor(() =>
      expect(acceptFriendRequest).toHaveBeenCalledWith("req1")
    );
  });

  it("shows empty state when there are no notifications", async () => {
    const { getFriendRequests } = await import("../../config/api");
    getFriendRequests.mockResolvedValueOnce({
      incomingReqs: [],
      acceptedReqs: [],
    });

    renderWithProviders(<NotificationPage />);

    expect(
      await screen.findByText(/no notifications yet/i)
    ).toBeInTheDocument();
  });

  it("renders accepted requests section", async () => {
    const { getFriendRequests } = await import("../../config/api");
    getFriendRequests.mockResolvedValueOnce({
      incomingReqs: [],
      acceptedReqs: [
        {
          _id: "acc1",
          recipient: {
            fullName: "Jane Roe",
            profilePic: "http://example.com/pic2.jpg",
          },
        },
      ],
    });

    renderWithProviders(<NotificationPage />);

    expect(await screen.findByText(/new connections/i)).toBeInTheDocument();
    expect(
      screen.getByText(/accepted your friend request/i)
    ).toBeInTheDocument();
  });
});
