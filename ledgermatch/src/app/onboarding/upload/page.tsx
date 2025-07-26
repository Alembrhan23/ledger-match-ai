'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase-client';
import { useRouter } from 'next/navigation';
const router = useRouter(); // ✅ this was missing!

type FileType = 'sales' | 'bank' | 'receipt';
const bucket = 'files';

export default function OnboardingUploadPage() {
  const [files, setFiles] = useState<Record<FileType, File | null>>({
    sales: null,
    bank: null,
    receipt: null,
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleFileChange = (type: FileType, file: File) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleUploadAll = async () => {
    setUploading(true);
    setMessage(null);
    setStatus(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('❌ You must be logged in to upload files.');
      }

      const userId = user.id;

      for (const [type, file] of Object.entries(files) as [FileType, File | null][]) {
        if (!file) continue;

        const path = `${type}/${userId}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: '3600', upsert: false });

        if (uploadError || !uploadData) throw new Error(uploadError?.message || 'Upload failed');

        const uploadedFilePath = uploadData.path;

        const tableMap: Record<FileType, string> = {
          sales: 'sales_reports',
          bank: 'bank_statements',
          receipt: 'receipts',
        };

        const { data: dbInsertData, error: dbInsertError } = await supabase
          .from(tableMap[type])
          .insert({
            user_id: userId,
            file_url: uploadedFilePath,
            uploaded_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (dbInsertError || !dbInsertData) {
          throw new Error(dbInsertError?.message || 'Failed to record metadata.');
        }

        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(uploadedFilePath, 60 * 5);

        if (signedUrlError || !signedUrlData?.signedUrl) {
          throw new Error('❌ Failed to generate signed URL for Mindee');
        }

        const apiRoutes: Record<FileType, string> = {
          sales: '/api/parse-sales-report',
          bank: '/api/parse-bank-statement',
          receipt: '/api/parse-receipt',
        };

        const requestBody = {
          fileUrl: signedUrlData.signedUrl,
          salesReportId: type === 'sales' ? dbInsertData.id : undefined,
          bankStatementId: type === 'bank' ? dbInsertData.id : undefined,
          receiptId: type === 'receipt' ? dbInsertData.id : undefined,
        };

        const parseRes = await fetch(apiRoutes[type], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!parseRes.ok) {
          const errorData = await parseRes.json();
          throw new Error(errorData.error || `Failed to parse ${type}`);
        }
      }

      setStatus('success');
      setMessage('✅ All files uploaded and parsed successfully!');
    } catch (err: any) {
      setStatus('error');
      setMessage(`❌ ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md">
        <p className="text-sm text-gray-500 text-center mb-1">Step 2 of 4</p>
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-2">Upload Your Files</h1>
        <p className="text-center text-gray-500 mb-6">Sales, bank, and expense receipts</p>

        {/* Upload fields */}
        {(['sales', 'bank', 'receipt'] as FileType[]).map((type) => (
          <div
            key={type}
            className="flex justify-between items-center border rounded-md px-4 py-3 mb-4 shadow-sm"
          >
            <span className="text-gray-800 font-medium capitalize">{type} file</span>
            <label className="text-blue-600 text-sm cursor-pointer">
              Choose file
              <input
                type="file"
                accept=".pdf,.csv,.jpg,.png"
                className="hidden"
                onChange={(e) => e.target.files && handleFileChange(type, e.target.files[0])}
              />
            </label>
          </div>
        ))}

        {/* Upload button */}
        <button
          onClick={handleUploadAll}
          disabled={uploading}
          className={`w-full py-2 mt-2 rounded-md text-white font-semibold transition ${
            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload & Continue'}
        </button>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-center p-3 text-sm rounded-md ${
              status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
      <button
  onClick={() => router.push('/onboarding/upload')}
  className="mt-6 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
>
  Continue →
</button>

    </div>
  );
}
