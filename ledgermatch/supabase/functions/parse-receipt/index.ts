
// /// <reference lib="deno.ns" />
// import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// const supabase = createClient(
//   Deno.env.get('SUPABASE_URL')!,
//   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
// )

// serve(async (req) => {
//   try {
//     const { file_url, file_type, user_id } = await req.json()

//     if (!file_url || !user_id) {
//       return new Response(JSON.stringify({ error: 'Missing file_url or user_id' }), { status: 400 })
//     }

//     const fileResponse = await fetch(file_url)
//     const fileBlob = await fileResponse.blob()

//     const formData = new FormData()
//     formData.append('document', fileBlob)

//     const mindeeResponse = await fetch('https://api.mindee.net/v1/products/mindee/receipt/v4/predict', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Token ${Deno.env.get('MINDEE_API_KEY')!}`
//       },
//       body: formData
//     })

//     const result = await mindeeResponse.json()
//     const parsed = result.document?.inference?.prediction

//     if (!parsed) {
//       return new Response(JSON.stringify({ error: 'Mindee parsing failed' }), { status: 500 })
//     }

//     const { error } = await supabase.from('sales_reports').insert([{
//       user_id,
//       file_url,
//       parsed_data: parsed,
//       created_at: new Date().toISOString()
//     }])

//     if (error) throw error

//     return new Response(JSON.stringify({ success: true, parsed }), { status: 200 })
//   } catch (err) {
//     console.error(err)
//     return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 })
//   }
// })





// // // Follow this setup guide to integrate the Deno language server with your editor:
// // // https://deno.land/manual/getting_started/setup_your_environment
// // // This enables autocomplete, go to definition, etc.

// // // Setup type definitions for built-in Supabase Runtime APIs
// // import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// // console.log("Hello from Functions!")

// // Deno.serve(async (req) => {
// //   const { name } = await req.json()
// //   const data = {
// //     message: `Hello ${name}!`,
// //   }

// //   return new Response(
// //     JSON.stringify(data),
// //     { headers: { "Content-Type": "application/json" } },
// //   )
// // })

// // /* To invoke locally:

// //   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
// //   2. Make an HTTP request:

// //   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-receipt' \
// //     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
// //     --header 'Content-Type: application/json' \
// //     --data '{"name":"Functions"}'

// // */
// // // 