import { createSupabaseServerClient } from '../../../lib/supabase-server.ts'
import { NextResponse } from 'next/server'
import { Client, product } from 'mindee'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const body = await req.json()
  const { fileUrl, salesReportId } = body

  const apiKey = process.env.MINDEE_API_KEY!
  const mindeeClient = new Client({ apiKey })

  try {
    const inputDoc = mindeeClient.docFromUrl(fileUrl)
    const apiResponse = await mindeeClient.parse(product.InvoiceV4, inputDoc)
    const parsedResult = apiResponse.document.inference.prediction

    const { error } = await supabase
      .from('sales_reports')
      .update({ parsed_data: parsedResult })
      .eq('id', salesReportId)

    if (error) throw error

    return NextResponse.json({ success: true, parsedResult })
  } catch (err: any) {
    console.error('[PARSE_SALES_REPORT_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Parse failed' }, { status: 500 })
  }
}
