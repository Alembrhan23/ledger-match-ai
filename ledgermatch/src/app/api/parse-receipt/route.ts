// /app/api/parse-receipt/route.ts

import { createSupabaseServerClient } from '../../../lib/supabase-server.ts'
import { NextResponse } from 'next/server'
import { Client, product } from 'mindee'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const body = await req.json()
  const { fileUrl, receiptId } = body
  
  const apiKey = process.env.MINDEE_API_KEY!
  const mindeeClient = new Client({ apiKey })

  try {
    // Debugging logs to inspect the values
    console.log('Received fileUrl:', fileUrl);
    console.log('Mindee API Key (first few chars):', apiKey?.substring(0, 5) + '...'); // Log partially for security
    
    // Likely fix: Use sourceFromUrl instead of docFromUrl
    const inputDoc = mindeeClient.docFromUrl(fileUrl) 
    
    // Debugging log for inputDoc
    console.log('Input Document Source:', inputDoc);

    const apiResponse = await mindeeClient.parse(product.InvoiceV4, inputDoc)

    const parsedResult = apiResponse.document.inference.prediction

    // Store the full JSON result in the 'extracted_text' column
    const { error } = await supabase
      .from('receipts')
      .update({ extracted_text: parsedResult })
      .eq('id', receiptId)

    if (error) throw error

    return NextResponse.json({ success: true, parsedResult })
  } catch (err: any) {
    console.error('[Parse Error]', err)
    return NextResponse.json({ error: err.message || 'Parse failed' }, { status: 500 })
  }
}
