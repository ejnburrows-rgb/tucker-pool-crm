'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, FileText, X, Check, Loader2, Users } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface ExtractedClient {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  monthly_rate: number;
  service_day: string;
  selected: boolean;
}

// Helper to parse client info from OCR text
// Supports English and Spanish labels (e.g., "Name:", "Nombre:", "Address:", "Dirección:")
// Matches text following the label until the end of the line
const parseClientInfo = (text: string) => {
  const nameMatch = text.match(/(?:name|nombre|client name|nombre del cliente)\s*[:.]?\s*([^\n\r]+)/i);
  const addressMatch = text.match(/(?:address|adress|direccion|dirección)\s*[:.]?\s*([^\n\r]+)/i);

  return {
    name: nameMatch ? nameMatch[1].trim() : '',
    address: addressMatch ? addressMatch[1].trim() : ''
  };
};

export function BulkImport({ onComplete }: { onComplete?: () => void }) {
  const t = useTranslations('bulkImport');
  const locale = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [extractedClients, setExtractedClients] = useState<ExtractedClient[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    const extracted: ExtractedClient[] = [];

    for (const file of files) {
      try {
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const text = await file.text();
          const lines = text.split('\n').filter((line) => line.trim());
          const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
            const client: ExtractedClient = {
              id: `csv-${Date.now()}-${i}`,
              name: values[headers.indexOf('name')] || values[headers.indexOf('nombre')] || values[0] || '',
              phone: values[headers.indexOf('phone')] || values[headers.indexOf('telefono')] || values[1] || '',
              address: values[headers.indexOf('address')] || values[headers.indexOf('direccion')] || values[2] || '',
              city: values[headers.indexOf('city')] || values[headers.indexOf('ciudad')] || 'Miami',
              monthly_rate: parseFloat(values[headers.indexOf('rate')] || values[headers.indexOf('tarifa')] || '150') || 150,
              service_day: values[headers.indexOf('day')] || values[headers.indexOf('dia')] || 'monday',
              selected: true,
            };
            if (client.name) {
              extracted.push(client);
            }
          }
        } else if (file.type.startsWith('image/')) {
          // Use 'eng+spa' to support both English and Spanish characters/documents
          const { data: { text } } = await Tesseract.recognize(file, 'eng+spa');
          const { name, address } = parseClientInfo(text);

          if (!name && !address) {
            toast.warning(`Could not read text from ${file.name}. Image may be blurry or contain no recognizable client data.`);
            continue;
          }

          extracted.push({
            id: `file-${Date.now()}-${Math.random()}`,
            name: name || `Client from ${file.name}`,
            phone: '',
            address: address || '',
            city: 'Miami',
            monthly_rate: 150,
            service_day: 'monday',
            selected: true,
          });
        } else {
          extracted.push({
            id: `file-${Date.now()}-${Math.random()}`,
            name: `Client from ${file.name}`,
            phone: '',
            address: '',
            city: 'Miami',
            monthly_rate: 150,
            service_day: 'monday',
            selected: true,
          });
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        toast.error(t('error').replace('{name}', file.name));
      }
    }

    setExtractedClients(extracted);
    setIsProcessing(false);
  };

  const toggleClient = (id: string) => {
    setExtractedClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const updateClient = (id: string, field: keyof ExtractedClient, value: string | number) => {
    setExtractedClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const importClients = async () => {
    const selectedClients = extractedClients.filter((c) => c.selected);
    if (selectedClients.length === 0) return;

    setIsImporting(true);
    const supabase = createClient();
    let successCount = 0;

    for (const client of selectedClients) {
      const { error } = await (supabase.from('clients') as any).insert({
        name: client.name,
        phone: client.phone,
        address: client.address,
        city: client.city,
        monthly_rate: client.monthly_rate,
        service_day: client.service_day,
        pool_type: 'chlorine',
        language: locale,
        is_active: true,
      });

      if (!error) {
        successCount++;
      }
    }

    toast.success(t('success').replace('{count}', successCount.toString()));
    setExtractedClients([]);
    setFiles([]);
    setIsImporting(false);
    onComplete?.();
  };

  const clearAll = () => {
    setFiles([]);
    setExtractedClients([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium">{t('dropzone')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('supported')}</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={processFiles} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                t('extracting')
              )}
            </Button>
          </div>
        )}

        {extractedClients.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">{t('preview')}</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {extractedClients.map((client) => (
                <div
                  key={client.id}
                  className={`p-3 border rounded-lg ${client.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleClient(client.id)}
                    >
                      {client.selected ? (
                        <Check className="h-4 w-4 text-blue-600" />
                      ) : (
                        <div className="h-4 w-4 border rounded" />
                      )}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={client.name}
                        onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <Input
                        value={client.phone}
                        onChange={(e) => updateClient(client.id, 'phone', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Address</Label>
                      <Input
                        value={client.address}
                        onChange={(e) => updateClient(client.id, 'address', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Rate</Label>
                      <Input
                        type="number"
                        value={client.monthly_rate}
                        onChange={(e) => updateClient(client.id, 'monthly_rate', parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={importClients} disabled={isImporting} className="flex-1">
                {isImporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t('import')}
              </Button>
              <Button variant="outline" onClick={clearAll}>
                {t('clear')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
