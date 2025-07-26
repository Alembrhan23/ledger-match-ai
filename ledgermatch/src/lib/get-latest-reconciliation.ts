// lib/get-latest-reconciliation.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../lib/types/supabase' // adjust path

export async function getLatestReconciliation() {
  const supabase = createClientComponentClient<Database>()

  const { data, error } = await supabase
    .from('reconciliations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) throw new Error(error.message)
  return data
}
