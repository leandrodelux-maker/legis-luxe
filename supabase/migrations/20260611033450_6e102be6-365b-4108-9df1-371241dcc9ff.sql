CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'documentos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documentos');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'documentos');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'documentos');
