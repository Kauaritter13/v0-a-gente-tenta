import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { error: r } = await supabase.from("resenhas").select("id").limit(1)
    const { error: c } = await supabase.from("collections").select("id").limit(1)
    const { error: p } = await supabase.from("responses").select("id").limit(1)

    const tables = { resenhas: !r, collections: !c, responses: !p }
    const allReady = tables.resenhas && tables.collections && tables.responses

    return NextResponse.json({
      status: allReady ? "ready" : "missing_tables",
      tables,
    })
  } catch {
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}
