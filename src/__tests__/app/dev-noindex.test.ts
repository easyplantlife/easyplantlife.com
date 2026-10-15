import { metadata } from "@/app/dev/layout";

describe("Dev pages", () => {
  it("are never indexed", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
