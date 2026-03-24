import { describe, expect, test } from "bun:test";

function classify(q: string): "tx" | "address" | "block" | "unknown" {
	if (q.startsWith("0x") && q.length === 66) return "tx";
	if (q.startsWith("0x") && q.length === 42) return "address";
	if (/^\d+$/.test(q)) return "block";
	return "unknown";
}

describe("Search classification", () => {
	test("66-char 0x is tx", () => expect(classify("0x" + "a".repeat(64))).toBe("tx"));
	test("42-char 0x is address", () => expect(classify("0x" + "b".repeat(40))).toBe("address"));
	test("digits is block", () => expect(classify("42")).toBe("block"));
});
