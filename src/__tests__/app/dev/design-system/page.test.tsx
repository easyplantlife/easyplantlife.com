/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesignSystemPage from "@/app/dev/design-system/page";

// Mock clipboard API at module level
const mockWriteText = jest.fn(() => Promise.resolve());

// Override navigator.clipboard before tests run
beforeAll(() => {
  Object.defineProperty(global.navigator, "clipboard", {
    value: {
      writeText: mockWriteText,
      readText: jest.fn(),
    },
    configurable: true,
  });
});

describe("Design System Reference Page", () => {
  beforeEach(() => {
    mockWriteText.mockClear();
  });

  describe("Development Access", () => {
    it("renders the page in development mode", () => {
      // Development mode is the default for Jest
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /design system/i, level: 1 })
      ).toBeInTheDocument();
    });
  });

  describe("Color Palette Section", () => {
    it("displays the colors section heading", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /colors/i, level: 2 })
      ).toBeInTheDocument();
    });

    it("shows primary color palette", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /primary/i, level: 3 })
      ).toBeInTheDocument();
    });

    it("shows neutral color palette", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /neutral/i, level: 3 })
      ).toBeInTheDocument();
    });

    it("shows background colors", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /background/i, level: 3 })
      ).toBeInTheDocument();
    });

    it("shows text colors section", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /text colors/i, level: 3 })
      ).toBeInTheDocument();
    });
  });

  describe("Typography Section", () => {
    it("displays the typography section heading", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /typography/i, level: 2 })
      ).toBeInTheDocument();
    });

    it("shows heading examples from h1 to h6", () => {
      render(<DesignSystemPage />);
      // All heading levels should be displayed as examples
      expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("heading", { level: 4 }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("heading", { level: 5 }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole("heading", { level: 6 }).length).toBeGreaterThan(0);
    });

    it("shows text size examples", () => {
      render(<DesignSystemPage />);
      // Should show text size scale examples (some may appear multiple times)
      expect(screen.getAllByText(/text-xs/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/text-sm/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/text-base/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/text-lg/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Component Variants Section", () => {
    it("displays the components section heading", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /components/i, level: 2 })
      ).toBeInTheDocument();
    });

    it("shows Button component variants", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /^button$/i, level: 3 })
      ).toBeInTheDocument();
      // Should display all button variants (Primary, Secondary, Ghost + size buttons + disabled)
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it("shows Link component examples", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /^link$/i, level: 3 })
      ).toBeInTheDocument();
      // Should display link examples
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("shows Input component examples", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /^input$/i, level: 3 })
      ).toBeInTheDocument();
      // Should display input examples
      const inputs = screen.getAllByRole("textbox");
      expect(inputs.length).toBeGreaterThanOrEqual(1);
    });

    it("shows Card component examples", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /^card$/i, level: 3 })
      ).toBeInTheDocument();
    });

    it("shows Container component examples", () => {
      render(<DesignSystemPage />);
      expect(
        screen.getByRole("heading", { name: /^container$/i, level: 3 })
      ).toBeInTheDocument();
    });
  });

  describe("Code Examples", () => {
    it("displays code snippets for components", () => {
      render(<DesignSystemPage />);
      // Should have code blocks with examples
      const codeBlocks = document.querySelectorAll("pre code, code");
      expect(codeBlocks.length).toBeGreaterThan(0);
    });

    it("has copy buttons for code snippets", () => {
      render(<DesignSystemPage />);

      // Find copy buttons
      const copyButtons = screen.getAllByRole("button", { name: /copy/i });
      expect(copyButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Page Layout", () => {
    it("uses Container component for layout", () => {
      render(<DesignSystemPage />);
      // The page should be wrapped in a container with proper max-width
      const container = document.querySelector(".mx-auto");
      expect(container).toBeInTheDocument();
    });

    it("organizes content into clear sections", () => {
      render(<DesignSystemPage />);
      // Should have main sections: Colors, Typography, Components
      expect(
        screen.getByRole("heading", { name: /colors/i, level: 2 })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /typography/i, level: 2 })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /components/i, level: 2 })
      ).toBeInTheDocument();
    });
  });
});
