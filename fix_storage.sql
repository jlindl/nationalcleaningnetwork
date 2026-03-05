-- 1. Ensure the bucket is set to PUBLIC in the storage database
update storage.buckets
set public = true
where id = 'documents';

-- 2. Ensure the bucket exists (in case it fell out of sync)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = true;

-- 3. Drop existing view policies to avoid conflicts
drop policy if exists "Cleaners can view own documents" on storage.objects;
drop policy if exists "Anyone can view public documents" on storage.objects;

-- 4. Create an explicit policy allowing public read access to the documents bucket
create policy "Anyone can view public documents"
on storage.objects for select
using ( bucket_id = 'documents' );
