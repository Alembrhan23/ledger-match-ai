// app/api/reconciliation-latest/route.ts

import { createSupabaseServerClient } from '../../../lib/supabase-server.ts'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('reconciliations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
