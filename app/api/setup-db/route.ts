import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { error: guestsError } = await supabase.from("guests").select("id").limit(1)
    const { error: resenhasError } = await supabase.from("resenhas").select("id").limit(1)
    const { error: invitesError } = await supabase.from("invites").select("id").limit(1)

    const tables = {
      guests: !guestsError,
      resenhas: !resenhasError,
      invites: !invitesError,
    }

    const allReady = tables.guests && tables.resenhas && tables.invites

    return NextResponse.json({
      status: allReady ? "ready" : "missing_tables",
      tables,
      message: allReady
        ? "Database is configured and ready."
        : "Some tables are missing. Run scripts/001_create_tables.sql in Supabase SQL Editor.",
    })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Could not connect to Supabase. Check environment variables." },
      { status: 500 }
    )
  }
}
