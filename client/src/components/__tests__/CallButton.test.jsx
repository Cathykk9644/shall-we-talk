import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import CallButton from "../CallButton";

describe("CallButton", () => {
  it("renders button and calls handler on click", () => {
    const onClick = vi.fn();
    render(<CallButton handleVideoCall={onClick} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
