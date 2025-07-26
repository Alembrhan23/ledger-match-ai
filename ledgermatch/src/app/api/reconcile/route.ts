import { createSupabaseServerClient } from '../../../lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createSupabaseServerClient()

  // 1. Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const userId = user.id

    // 2. Fetch latest sales report
    const { data: salesReport, error: salesError } = await supabase
      .from('sales_reports')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .single()

    if (salesError || !salesReport?.parsed_data) {
      throw new Error('No sales report found')
    }

    // 3. Fetch latest bank statement
    const { data: bankStatement, error: bankError } = await supabase
      .from('bank_statements')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .single()

    if (bankError || !bankStatement?.parsed_data) {
      throw new Error('No bank statement found')
    }

    // 4. Extract sales total
    const salesTotal = salesReport.parsed_data.totalNet?.value ?? 0

    // 5. Extract deposit total from bank line items
    const deposits = (bankStatement.parsed_data?.lineItems ?? [])
      .filter((item: any) =>
        (item.description?.toLowerCase() ?? '').includes('deposit') ||
        (item.description?.toLowerCase() ?? '').includes('credit')
      )
      .reduce((sum: number, item: any) => sum + (item.totalAmount ?? 0), 0)

    const gap = parseFloat((salesTotal - deposits).toFixed(2))
    const gapPercent = parseFloat(((gap / (salesTotal || 1)) * 100).toFixed(2)) // Avoid divide by 0

    // 6. Store in reconciliation table
    const { error: insertError } = await supabase.from('reconciliations').insert({
      user_id: userId,
      sales_report_id: salesReport.id,
      bank_statement_id: bankStatement.id,
      cash_reported: salesTotal,
      cash_found: deposits,
      gap,
      gap_percent: gapPercent,
    })

    if (insertError) throw insertError

    return NextResponse.json({
      success: true,
      salesTotal,
      deposits,
      gap,
      gapPercent,
    })
  } catch (err: any) {
    console.error('[RECONCILE_ERROR]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
