import { render, screen } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

// Mock the heavy layout and pages to keep router tests fast
vi.mock("./components/Layout.jsx", () => ({
  default: ({ children }) => <div>Layout{children}</div>,
}));
vi.mock("./pages/HomePage", () => ({ default: () => <div>Home</div> }));
vi.mock("./pages/PracticeDashboard", () => ({
  default: () => <div>PracticeDashboard</div>,
}));
vi.mock("./pages/OnboardingPage", () => ({
  default: () => <div>Onboarding</div>,
}));
vi.mock("./pages/LoginPage", () => ({ default: () => <div>Login</div> }));
vi.mock("./pages/SignUpPage", () => ({ default: () => <div>Signup</div> }));
vi.mock("./pages/NotificationPage", () => ({
  default: () => <div>Notifications</div>,
}));
vi.mock("./pages/ProfilePage.jsx", () => ({
  default: () => <div>Profile</div>,
}));
vi.mock("./pages/ChatPage", () => ({ default: () => <div>Chat</div> }));
vi.mock("./pages/VideoCallPage", () => ({ default: () => <div>Call</div> }));

const renderApp = async (auth) => {
  vi.resetModules();
  vi.doMock("./hooks/useAuthUser.js", () => ({
    default: () => auth,
  }));
  const { default: AppMod } = await import("./App");
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[auth.initialPath || "/"]}>
        <AppMod />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("App routing guards", () => {
  it("redirects unauthenticated user from /practice-dashboard to /login", async () => {
    await renderApp({
      isLoading: false,
      authUser: null,
      initialPath: "/practice-dashboard",
    });
    expect(await screen.findByText("Login")).toBeInTheDocument();
  });

  it("redirects authenticated but not onboarded user from /practice-dashboard to /onboarding", async () => {
    await renderApp({
      isLoading: false,
      authUser: { isOnboarded: false },
      initialPath: "/practice-dashboard",
    });
    expect(await screen.findByText("Onboarding")).toBeInTheDocument();
  });

  it("shows dashboard when authenticated and onboarded", async () => {
    await renderApp({
      isLoading: false,
      authUser: { isOnboarded: true },
      initialPath: "/practice-dashboard",
    });
    expect(await screen.findByText("PracticeDashboard")).toBeInTheDocument();
  });
});
