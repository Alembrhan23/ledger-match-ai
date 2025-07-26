// /app/api/generate-tax-return/route.ts
import { createSupabaseServerClient } from '../../../lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { reconciliationId } = await req.json()

  const { data: reconciliation, error } = await supabase
    .from('reconciliations')
    .select('*')
    .eq('id', reconciliationId)
    .single()

  if (error || !reconciliation) {
    return NextResponse.json({ error: 'Reconciliation not found' }, { status: 404 })
  }

  const taxRate = 8.81 // Example for Denver, update dynamically later
  const taxDue = reconciliation.cash_reported * (taxRate / 100)

  const { data: inserted, error: insertError } = await supabase
    .from('tax_returns')
    .insert({
      user_id: reconciliation.user_id,
      reconciliation_id: reconciliation.id,
      tax_due: taxDue,
      tax_rate: taxRate
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, taxReturn: inserted })
}
