import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";

const idOk = (id: string) => /^[A-Za-z0-9_]{1,80}$/.test(id);

const itemSchema = z.object({
  id: z.string().max(80),
  x: z.number().finite(),
  y: z.number().finite(),
  z: z.number().finite(),
  rx: z.number().finite(),
  ry: z.number().finite(),
  rz: z.number().finite(),
  rw: z.number().finite(),
  settled: z.boolean(),
});

export type PileRow = z.infer<typeof itemSchema>;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const getPile = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    rw: number;
    settled: boolean;
  }>`select id, x, y, z, rx, ry, rz, rw, settled from pile_item`;
  return rows
    .filter((row) => idOk(row.id))
    .map((row) => ({
      id: row.id,
      x: Number(row.x),
      y: Number(row.y),
      z: Number(row.z),
      rx: Number(row.rx),
      ry: Number(row.ry),
      rz: Number(row.rz),
      rw: Number(row.rw),
      settled: Boolean(row.settled),
    }));
});

export const savePile = createServerFn({ method: "POST" })
  .validator(z.object({ items: z.array(itemSchema).max(80) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    for (const item of data.items) {
      if (!idOk(item.id)) continue;
      const x = clamp(item.x, -20, 20);
      const y = clamp(item.y, -2, 30);
      const z = clamp(item.z, -20, 20);
      await sql`
        insert into pile_item (id, x, y, z, rx, ry, rz, rw, settled)
        values (${item.id}, ${x}, ${y}, ${z}, ${item.rx}, ${item.ry}, ${item.rz}, ${item.rw}, ${item.settled})
        on conflict (id) do update set
          x = case when excluded.settled or not pile_item.settled then excluded.x else pile_item.x end,
          y = case when excluded.settled or not pile_item.settled then excluded.y else pile_item.y end,
          z = case when excluded.settled or not pile_item.settled then excluded.z else pile_item.z end,
          rx = case when excluded.settled or not pile_item.settled then excluded.rx else pile_item.rx end,
          ry = case when excluded.settled or not pile_item.settled then excluded.ry else pile_item.ry end,
          rz = case when excluded.settled or not pile_item.settled then excluded.rz else pile_item.rz end,
          rw = case when excluded.settled or not pile_item.settled then excluded.rw else pile_item.rw end,
          settled = pile_item.settled or excluded.settled,
          updated_at = now()
      `;
    }
    return { ok: true };
  });
