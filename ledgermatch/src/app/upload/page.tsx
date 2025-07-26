'use client'

import { useState } from 'react';
import { supabase } from '../../lib/supabase-client';
import { CloudUpload } from 'lucide-react';

type FileType = 'sales' | 'bank' | 'receipt';
const bucket = 'files'; // Your Supabase bucket name

export default function UploadPage() {
  const [fileType, setFileType] = useState<FileType>('sales');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

 const handleUpload = async () => {
  setMessage(null);
  setStatus(null);

  if (!file) {
    setMessage('❗ Please select a file to upload.');
    setStatus('error');
    return;
  }

  setIsUploading(true);

  try {
    // ✅ 1. Get User
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage('❌ You must be logged in to upload files.');
      setStatus('error');
      setIsUploading(false);
      return;
    }

    const userId = user.id;

    // ✅ 2. Upload to Supabase Storage
    const path = `${fileType}/${userId}/${Date.now()}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError || !uploadData) {
      throw new Error(uploadError?.message || 'Upload failed');
    }

    const uploadedFilePath = uploadData.path;

    // ✅ 3. Record metadata in DB
    const tableMap: Record<FileType, string> = {
      sales: 'sales_reports',
      bank: 'bank_statements',
      receipt: 'receipts',
    };

    const { data: dbInsertData, error: dbInsertError } = await supabase
      .from(tableMap[fileType])
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

    // ✅ 4. Create Signed URL
    if (['receipt', 'bank', 'sales'].includes(fileType)) {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(uploadedFilePath, 60 * 5); // 5 minutes

      if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error('❌ Failed to generate signed URL for Mindee');
      }

      const publicFileUrl = signedUrlData.signedUrl;

      // ✅ 5. Choose correct API route
      const apiRoutes: Record<FileType, string> = {
        receipt: '/api/parse-receipt',
        bank: '/api/parse-bank-statement',
        sales: '/api/parse-sales-report',
      };

      const requestBody = {
        fileUrl: publicFileUrl,
        receiptId: fileType === 'receipt' ? dbInsertData.id : undefined,
        bankStatementId: fileType === 'bank' ? dbInsertData.id : undefined,
        salesReportId: fileType === 'sales' ? dbInsertData.id : undefined,
      };

      const parseResponse = await fetch(apiRoutes[fileType], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.error || 'Failed to parse document via API route');
      }

      // ✅ 6. Success Message
      const label = fileType === 'sales' ? 'Sales report' : fileType === 'bank' ? 'Bank statement' : 'Receipt';
      setMessage(`✅ ${label} parsed successfully!`);
      setStatus('success');
    }
  } catch (error: any) {
    console.error('Upload Error:', error);
    setMessage(`❌ Upload failed: ${error.message}`);
    setStatus('error');
  } finally {
    setIsUploading(false);
    setFile(null);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Your File</h1>

        <div className="mb-4">
          <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
            Select File Type:
          </label>
          <select
            id="fileType"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={fileType}
            onChange={(e) => setFileType(e.target.value as FileType)}
          >
            <option value="sales">Sales Report</option>
            <option value="bank">Bank Statement</option>
            <option value="receipt">Expense Receipt</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-2">
            Choose File:
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              {file ? (
                <div className="flex items-center space-x-2">
                  <CloudUpload className="text-gray-500" size={24} />
                  <span className="text-gray-700">{file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudUpload className="text-gray-400 mb-2" size={32} />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG, PDF (MAX. 5MB)
                  </p>
                </div>
              )}
              <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
            </label>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-200 ${
            isUploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm text-center ${
              status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}