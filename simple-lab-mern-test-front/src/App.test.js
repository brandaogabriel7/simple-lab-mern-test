import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders hello", () => {
  render(<App />);
  const hello = screen.getByRole("heading", { name: /hello/i });
  expect(hello).toBeInTheDocument();
});
