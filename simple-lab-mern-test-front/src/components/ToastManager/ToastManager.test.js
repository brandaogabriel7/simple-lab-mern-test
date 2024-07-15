import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./ToastManager";

describe("toast manager tests", () => {
  it.each([["success"], ["danger"], ["warning"], ["info"]])(
    "should show toast message with %s variant",
    async (variant) => {
      const user = userEvent.setup();
      const toast = {
        title: "Test title",
        message: "Test message",
        delay: 1,
      };

      const ComponentThatShowsToast = () => {
        const { addToast } = useToast();
        return (
          <>
            <button
              onClick={() =>
                addToast(toast.title, toast.message, variant, toast.delay)
              }
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
      expect(toastElement).toHaveTextContent(toast.title);
      expect(toastElement).toHaveTextContent(toast.message);

      await waitForElementToBeRemoved(() => screen.queryByRole("alert"));
    }
  );
});
