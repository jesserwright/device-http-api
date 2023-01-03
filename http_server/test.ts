import { Device, verifyDeviceInput } from "./util.ts";
import { assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";

Deno.test("verify device input: valid", () => {
  const deviceJson = '{"type":"button","version":2,"description":"my desc"}';
  const maybeDevice: Device = JSON.parse(deviceJson);
  const validDevice = verifyDeviceInput(maybeDevice)!;

  // Nullish coalescing only to prevent runtime exception during test run
  assertEquals("button", validDevice?.type);
  assertEquals(2, validDevice?.version);
  assertEquals("my desc", validDevice?.description);
});

Deno.test("verify device input: invalid, field", () => {
  const deviceJson = '{"type":"button","version":2,"BAD_FIELD":"my desc"}';
  const maybeDevice: Device = JSON.parse(deviceJson);
  const validDevice = verifyDeviceInput(maybeDevice);
  assertEquals(null, validDevice);
});

Deno.test("verify device input: invalid description length", () => {
  const deviceJson =
    '{"type":"button","version":2,"description":"asdfjlksadjlfklsajdfjlasdjf;lasdjfkljasdasdfjlksadjlfklsajdfjlasdjf;lasdjfkljasdasdfjlksadjlfklsajdfjlasdjf;lax"}';
  const maybeDevice: Device = JSON.parse(deviceJson);
  const validDevice = verifyDeviceInput(maybeDevice);
  assertEquals(null, validDevice);
});

Deno.test("verify device input: invalid type length", () => {
  const deviceJson = '{"type":"abcdefghi","version":2,"description":"desc123"}';
  const maybeDevice: Device = JSON.parse(deviceJson);
  const validDevice = verifyDeviceInput(maybeDevice);
  assertEquals(null, validDevice);
});
