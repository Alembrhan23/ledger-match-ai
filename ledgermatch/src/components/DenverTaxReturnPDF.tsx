'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Styling for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
})

export function DenverTaxReturnPDF({ data }: { data: any }) {
  const {
    businessName = 'LedgerMatch Business',
    tax_due,
    tax_rate,
    calculated_on,
    reconciliation_id,
  } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>📄 Denver Sales Tax Return</Text>

        <View style={styles.field}>
          <Text><Text style={styles.label}>Business Name:</Text> {businessName}</Text>
          <Text><Text style={styles.label}>Filing Date:</Text> {new Date(calculated_on).toLocaleDateString()}</Text>
          <Text><Text style={styles.label}>Reconciliation ID:</Text> {reconciliation_id}</Text>
        </View>

        <View style={styles.field}>
          <Text><Text style={styles.label}>Gross Sales:</Text> ${tax_due / (tax_rate / 100)}</Text>
          <Text><Text style={styles.label}>Tax Rate:</Text> {tax_rate}%</Text>
          <Text><Text style={styles.label}>Tax Due:</Text> ${tax_due}</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Signature: ___________________________</Text>
          <Text>Date: _______________________________</Text>
        </View>
      </Page>
    </Document>
  )
}
