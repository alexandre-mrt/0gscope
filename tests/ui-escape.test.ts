import { describe, expect, test } from "bun:test";
import { errorPage } from "../src/ui";

describe("UI escaping edge cases", () => {
	test("escapes angle brackets", () => {
		const html = errorPage("<b>bold</b>");
		expect(html).toContain("&lt;b&gt;");
	});

	test("escapes ampersands", () => {
		const html = errorPage("A & B");
		expect(html).toContain("&amp;");
	});
});
