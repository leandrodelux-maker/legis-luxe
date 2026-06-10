-- Create policy for public read access
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'documentos');

-- Create policy for authenticated uploads
CREATE POLICY "Authenticated Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documentos' AND auth.role() = 'authenticated');

-- Create policy for authenticated updates
CREATE POLICY "Authenticated Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'documentos' AND auth.role() = 'authenticated');

-- Create policy for authenticated deletes
CREATE POLICY "Authenticated Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'documentos' AND auth.role() = 'authenticated');
