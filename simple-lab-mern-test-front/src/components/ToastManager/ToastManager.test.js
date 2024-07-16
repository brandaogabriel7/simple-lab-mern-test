import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./ToastManager";

describe("toast manager tests", () => {
  // FLAKY TEST: this test might fail if the delay is too short
  it.each([
    ["success", "Success title", "Success message"],
    ["danger", "Danger title", "Danger message"],
    ["warning", "Warning title", "Warning message"],
    ["info", "Info title", "Info message"],
  ])(
    "should show %s variant toast with '%s' title and '%s' message",
    async (variant, title, message) => {
      // this should be a small enough delay for the test assertions to work but not take too long to run the test
      // for some reason using fake timers did not work well for these test cases.
      // you can increase this value if the test starts to fail by time out but try not to increase too much
      const toastDelay = 10;

      const user = userEvent.setup();

      const ComponentThatShowsToast = () => {
        const { addToast } = useToast();
        return (
          <>
            <button
              onClick={() => addToast(title, message, variant, toastDelay)}
            >
              Test
            </button>
          </>
        );
      };
      render(
        <ToastProvider>
          <ComponentThatShowsToast />
        </ToastProvider>
      );

      const button = screen.getByRole("button", { name: /test/i });
      await user.click(button);

      const toastElement = await screen.findByRole("alert");
      expect(toastElement).toBeInTheDocument();
      expect(toastElement).toHaveAttribute("variant", variant);
      expect(toastElement).toHaveTextContent(title);
      expect(toastElement).toHaveTextContent(message);

      await waitForElementToBeRemoved(() => screen.queryByRole("alert"));
    }
  );
});
