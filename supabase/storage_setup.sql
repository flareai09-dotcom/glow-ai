-- Supabase Storage Setup for Skin Scans
-- Run this in the Supabase SQL Editor

-- 1. Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('scan-images', 'scan-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Clear existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Users Delete Own" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow user to delete images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;

-- 3. Policy: Allow Public to VIEW images (Required for users to see each other's scans or their own without tokens)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'scan-images' );

-- 4. Policy: Allow Authenticated users to UPLOAD their own scans
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'scan-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Policy: Allow users to DELETE their own scans
CREATE POLICY "Users Delete Own"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'scan-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);
