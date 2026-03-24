import { describe, expect, test } from "bun:test";
import { dashboardPage, errorPage } from "../src/ui";

describe("HTML document structure", () => {
	const stats = { network: "testnet" as const, blockNumber: 1, gasPrice: "1", chainId: 16602, timestamp: Date.now() };

	test("pages close all tags", () => {
		const pages = [
			dashboardPage(stats, [], "testnet"),
			errorPage("test"),
		];
		for (const page of pages) {
			expect(page).toContain("</html>");
			expect(page).toContain("</body>");
		}
	});

	test("pages have charset and viewport", () => {
		const page = dashboardPage(stats, [], "testnet");
		expect(page).toContain("UTF-8");
		expect(page).toContain("viewport");
	});
});
