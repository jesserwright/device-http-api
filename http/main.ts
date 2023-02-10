import { postgresjs, serve, serveDir, Status } from "./deps.ts";
import { Device, verifyDeviceInput } from "./util.ts";

const PASSWORD = Deno.env.get("POSTGRES_PASSWORD");
const HOSTNAME = Deno.env.get("POSTGRES_HOSTNAME");
const PSQL_CON_STR = `postgresql://postgres:${PASSWORD}@${HOSTNAME}:5432/postgres`;
const sql = postgresjs(PSQL_CON_STR);

const STATIC_FILE_PATTERN = new URLPattern({
  pathname: "/*.:filetype(js|html)",
});

async function handler(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (STATIC_FILE_PATTERN.test(request.url) || pathname === "/") {
    return serveDir(request, { fsRoot: "public" });
  }

  if (pathname === "/device") {
    return await handleDevice(request);
  }

  return new Response(null, { status: Status.NotFound });
}

async function handleDevice(request: Request): Promise<Response> {
  const method = request.method;
  const { searchParams } = new URL(request.url);

  if (method === "GET") {
    const id = searchParams.get("id");
    const devices = await sql<Device[]>`
      SELECT id, type, version, description FROM device
      ${id ? sql`WHERE id = ${id}` : sql``}`;
    if (id && devices.length < 1) {
      return new Response(null, { status: Status.NotFound });
    }
    return Response.json(devices);
  }

  if (method === "POST") {
    const input: Device = await request.json();
    if (verifyDeviceInput(input) === null) {
      return new Response(null, { status: Status.UnprocessableEntity });
    }
    const { type, version, description } = input;
    const newDevice = await sql<{ id: string }[]>`
      INSERT INTO device ("type", "version", "description")
      VALUES ${sql([type, version, description])}
      RETURNING id`;
    if (newDevice.length > 0) {
      return new Response(JSON.stringify(newDevice[0]), {
        status: Status.Created,
      });
    }
  }

  if (method === "PUT") {
    const input: Device = await request.json();
    if (input?.id === null || verifyDeviceInput(input) === null) {
      return new Response(null, { status: Status.UnprocessableEntity });
    }
    const updateSql = sql(input, "type", "version", "description");
    const updatedDevice = await sql<{ id: string }[]>`
      UPDATE device
      SET ${updateSql}
      WHERE id = ${input.id}
      RETURNING id`;
    if (updatedDevice.length > 0) {
      const device = updatedDevice[0];
      if (device?.id !== null) {
        return Response.json({ id: input.id });
      }
    }
  }

  if (method === "DELETE") {
    const id = await request.json();
    if (id?.id === null) {
      return new Response(null, { status: Status.UnprocessableEntity });
    }
    const deletedDevice = await sql<{ id: string }[]>`
      DELETE FROM device
      WHERE id = ${id.id}
      RETURNING id`;
    if (deletedDevice.length > 0) {
      const device = deletedDevice[0];
      if (device?.id !== null) {
        return Response.json({ id: device.id });
      }
    }
  }

  return new Response(null, { status: Status.NotFound });
}

await serve(handler, { port: 80 });