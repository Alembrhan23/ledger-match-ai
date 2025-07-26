'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { DenverTaxReturnPDF } from './DenverTaxReturnPDF'

export default function DownloadDenverReturn({ taxReturn }: { taxReturn: any }) {
  return (
    <div className="mt-4">
      <PDFDownloadLink
        document={<DenverTaxReturnPDF data={taxReturn} />}
        fileName="denver-tax-return.pdf"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {({ loading }) => loading ? 'Preparing PDF...' : 'Download Denver Tax Return'}
      </PDFDownloadLink>
    </div>
  )
}
