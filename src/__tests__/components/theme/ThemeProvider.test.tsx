import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/theme";
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from "@/lib/theme";

function ThemeReadout() {
  const { theme } = useTheme();
  return <output data-testid="theme-readout">{theme}</output>;
}

describe("ThemeProvider", () => {
  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  it("defaults to the light theme", () => {
    render(
      <ThemeProvider>
        <ThemeReadout />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-readout")).toHaveTextContent("light");
  });

  it("adopts the theme already applied to the document on mount", () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, "dark");
    render(
      <ThemeProvider>
        <ThemeReadout />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme-readout")).toHaveTextContent("dark");
  });

  it("falls back to a light, no-op context without a provider", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ThemeReadout />
        <ThemeToggle />
      </>
    );
    expect(screen.getByTestId("theme-readout")).toHaveTextContent("light");
    await user.click(screen.getByRole("button"));
    expect(screen.getByTestId("theme-readout")).toHaveTextContent("light");
  });
});

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  function renderToggle() {
    return render(
      <ThemeProvider>
        <ThemeToggle />
        <ThemeReadout />
      </ThemeProvider>
    );
  }

  it("names the theme it will switch to", () => {
    renderToggle();
    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
  });

  it("switches the theme, updates the document and persists the choice", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: /dark/i }));

    expect(screen.getByTestId("theme-readout")).toHaveTextContent("dark");
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });

  it("toggles back to light", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("theme-readout")).toHaveTextContent("light");
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
      "light"
    );
  });

  it("is keyboard operable", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByTestId("theme-readout")).toHaveTextContent("dark");
  });

  it("renders an icon that is hidden from assistive tech", () => {
    renderToggle();
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
