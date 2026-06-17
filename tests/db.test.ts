import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock mongoose so the cache contract is verified without a live database.
const { connectMock } = vi.hoisted(() => ({ connectMock: vi.fn() }));
vi.mock("mongoose", () => ({ default: { connect: connectMock } }));

describe("dbConnect", () => {
  const ORIGINAL_URI = process.env.MONGODB_URI;

  beforeEach(() => {
    connectMock.mockReset();
    // Drop the module-scoped cache so each test starts from a clean connection.
    (globalThis as Record<string, unknown>)._mongoose = undefined;
    vi.resetModules();
  });

  afterEach(() => {
    process.env.MONGODB_URI = ORIGINAL_URI;
  });

  it("connects once and reuses the cached connection", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
    const fakeConn = { connection: { readyState: 1 } };
    connectMock.mockResolvedValue(fakeConn);

    const { dbConnect } = await import("@/lib/db");
    const first = await dbConnect();
    const second = await dbConnect();

    expect(first).toBe(fakeConn);
    expect(second).toBe(fakeConn);
    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenCalledWith(
      "mongodb://localhost:27017/test",
      expect.objectContaining({ bufferCommands: false }),
    );
  });

  it("throws a helpful error when MONGODB_URI is unset", async () => {
    delete process.env.MONGODB_URI;
    const { dbConnect } = await import("@/lib/db");
    await expect(dbConnect()).rejects.toThrow(/MONGODB_URI/);
    expect(connectMock).not.toHaveBeenCalled();
  });

  it("clears the cached promise so a failed connect can be retried", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
    connectMock.mockRejectedValueOnce(new Error("boom"));

    const { dbConnect } = await import("@/lib/db");
    await expect(dbConnect()).rejects.toThrow("boom");

    const fakeConn = { connection: { readyState: 1 } };
    connectMock.mockResolvedValue(fakeConn);
    await expect(dbConnect()).resolves.toBe(fakeConn);
    expect(connectMock).toHaveBeenCalledTimes(2);
  });
});
