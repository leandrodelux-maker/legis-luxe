-- Liga as atas de jun-ago/2024 às suas sessões e grava a hora registrada em cada ata.
-- Os PDFs ficam em public/atas/2024. O Termo de Posse não traz hora, por isso a data segue como está.
begin;
update public.sessoes set ata_url = '/atas/2024/2024-06-03-ordinaria-018.pdf', ata_publicada = true, data_sessao = '2024-06-03 19:07:00-03' where id = '9bbffcd0-e30f-4289-b865-8e1baa66de81' and titulo = '018 SESSÃO ORDINÁRIA 2024';
update public.sessoes set ata_url = '/atas/2024/2024-06-04-ordinaria-019.pdf', ata_publicada = true, data_sessao = '2024-06-04 19:03:00-03' where id = '31c406b1-ff26-4470-9067-e24848c258ee' and titulo = '019 SESSÃO ORDINÁRIA 2024';
update public.sessoes set ata_url = '/atas/2024/2024-06-05-ordinaria-020.pdf', ata_publicada = true, data_sessao = '2024-06-05 19:07:00-03' where id = '201495b6-9e6a-450c-bfad-05972f6a81d9' and titulo = '020 SESSÃO ORDINÁRIA 2024';
update public.sessoes set ata_url = '/atas/2024/2024-06-17-ordinaria-021.pdf', ata_publicada = true, data_sessao = '2024-06-17 19:15:00-03' where id = 'f558b694-0a0d-4c73-8bad-229ad2cffa86' and titulo = '021 SESSÃO ORDINÁRIA 2024';
update public.sessoes set ata_url = '/atas/2024/2024-06-18-ordinaria-022.pdf', ata_publicada = true, data_sessao = '2024-06-18 19:20:00-03' where id = '440cf53c-5004-4614-949e-d347ee85b3c0' and titulo = '022 SESSÃO ORDINÁRIA 2024';
update public.sessoes set ata_url = '/atas/2024/2024-07-10-extraordinaria-003.pdf', ata_publicada = true, data_sessao = '2024-07-10 19:08:00-03' where id = '96acf080-ab65-4e58-8ff0-ac34f7a28f88' and titulo = 'SESSÃO EXTRA-ORDINÁRIA 003 2024';
update public.sessoes set ata_url = '/atas/2024/2024-07-10-extraordinaria-004.pdf', ata_publicada = true, data_sessao = '2024-07-10 20:10:00-03' where id = 'b553b72b-b875-4d55-8194-aa91a677b4ee' and titulo = 'SESSÃO EXTRA-ORDINÁRIA 004 2024';
update public.sessoes set ata_url = '/atas/2024/2024-08-05-ordinaria-023.pdf', ata_publicada = true, data_sessao = '2024-08-05 19:07:00-03' where id = 'eb155543-e31e-4599-8b2c-c1e18484d167' and titulo = '023 SESSÃO ORDINÁRIA 2024';
update public.sessoes set ata_url = '/atas/2024/2024-08-07-ordinaria-024.pdf', ata_publicada = true, data_sessao = '2024-08-07 19:20:00-03' where id = 'cbb65db4-5a5b-4670-9e7e-aa2dd424aace' and titulo = '024 SESSÃO ORDINÁRIA 2024';
update public.sessoes set ata_url = '/atas/2024/2024-08-08-termo-de-posse.pdf', ata_publicada = true where id = '187420a8-01aa-49f7-bedd-2d94d9f330c2' and titulo = 'SESSÃO SOLENE DE POSSE DE SUPLENTE';
commit;
