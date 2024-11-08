import { sanitizeOrgName } from "./certificate";

describe("sanitizeOrgName", () => {
  it("replaces invalid chars from an ipv6 string", () => {
    const result = sanitizeOrgName("Incus UI [::1] (Browser Generated)");

    expect(result).toBe("Incus UI ::1 (Browser Generated)");
  });

  it("keeps a valid domain name", () => {
    const result = sanitizeOrgName(
      "Incus UI foo.example.com (Browser Generated)",
    );

    expect(result).toBe("Incus UI foo.example.com (Browser Generated)");
  });

  it("keeps a valid ipv4 address", () => {
    const result = sanitizeOrgName("Incus UI 127.0.0.1 (Browser Generated)");

    expect(result).toBe("Incus UI 127.0.0.1 (Browser Generated)");
  });
});
