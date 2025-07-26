import { createSupabaseServerClient } from '../../../lib/supabase-server.ts';
import { NextResponse } from 'next/server';
import { Client, product } from 'mindee';

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json();
  const { fileUrl, bankStatementId } = body;

  const apiKey = process.env.MINDEE_API_KEY!;
  const mindeeClient = new Client({ apiKey });

  try {
    const inputDoc = mindeeClient.docFromUrl(fileUrl);
    
    // NOTE: You may customize the document type if needed — InvoiceV4 works fine for bank-style layouts
    const apiResponse = await mindeeClient.parse(product.InvoiceV4, inputDoc);
    const parsedResult = apiResponse.document.inference.prediction;

    const { error } = await supabase
      .from('bank_statements')
      .update({ parsed_data: parsedResult })  // Use 'parsed_data' or 'extracted_text' as your schema
      .eq('id', bankStatementId);

        console.log('[ParseBank] Route hit');
        console.log('Request body:', body);

    if (error) throw error;

    return NextResponse.json({ success: true, parsedResult });
  } catch (err: any) {
    console.error('[Parse Bank Error]', err);
    return NextResponse.json({ error: err.message || 'Parse failed' }, { status: 500 });
  }
}
