INSERT INTO traditions (id, name, region, language_primary, visibility) VALUES
('trad-001', 'Igbo Heritage', 'Nigeria', 'ig', 'public'),
('trad-002', 'Yoruba Heritage', 'Nigeria', 'yo', 'public'),
('trad-003', 'Haitian Creole Heritage', 'Haiti', 'ht', 'public');

INSERT INTO elders (id, tradition_id, name, lineage, bio, photo_url, languages) VALUES
('elder-001', 'trad-001', 'Ifeanyi Ejiọgbè', 'Obi clan', 'A respected teacher who preserves songs and proverbs from the royal Obi line.', 'https://example-bucket/media/elders/ifeanyi.jpg', 'ig,en'),
('elder-002', 'trad-002', 'Nnamdi Ejiọgbè', 'Oko clan', 'Community historian focused on farming rites and oral history.', 'https://example-bucket/media/elders/nnamdi.jpg', 'yo,en'),
('elder-003', 'trad-003', 'Ifeoma Ejiọgbè', 'Umu clan', 'Singer and storyteller who mentors youth choirs.', 'https://example-bucket/media/elders/ifeoma.jpg', 'ha,fr,en');

INSERT INTO recordings (id, tradition_id, elder_id, title, language, duration_ms, storage_url, consent_status, visibility, published_at, created_at) VALUES
('rec-001', 'trad-001', 'elder-001', 'Ancient Igbo Proverbs and Their Meanings', 'ig', 1800000, 'https://example-bucket/media/recordings/igbo_proverbs.mp3', 'public', 'public', '2025-09-01 10:00:00', NOW()),
('rec-002', 'trad-001', 'elder-001', 'The History of the Obi Clan', 'en', 2100000, 'https://example-bucket/media/recordings/obi_history.mp3', 'public', 'public', '2025-09-15 11:30:00', NOW()),
('rec-003', 'trad-002', 'elder-002', 'Yoruba Farming Rites and Harvest Songs', 'yo', 2400000, 'https://example-bucket/media/recordings/yoruba_farming.mp3', 'public', 'public', '2025-09-20 14:00:00', NOW()),
('rec-004', 'trad-002', 'elder-002', 'Oral History of the Oko Village', 'en', 1950000, 'https://example-bucket/media/recordings/oko_history.mp3', 'public', 'public', '2025-10-01 09:00:00', NOW()),
('rec-005', 'trad-003', 'elder-003', 'Haitian Creole Children''s Songs', 'ht', 1500000, 'https://example-bucket/media/recordings/haitian_songs.mp3', 'public', 'public', '2025-10-05 16:00:00', NOW()),
('rec-006', 'trad-003', 'elder-003', 'Traditional French-African Storytelling', 'fr', 2200000, 'https://example-bucket/media/recordings/french_storytelling.mp3', 'public', 'public', '2025-10-10 13:00:00', NOW());

INSERT INTO transcript_segments (id, recording_id, segment_index, start_ms, end_ms, text_original, qc_status) VALUES
('seg-001', 'rec-001', 0, 0, 5000, 'Okwu ochie Igbo na nkọwa ha.', 'approved'),
('seg-002', 'rec-001', 1, 5001, 10000, 'Ndi okenye anyi na-ekwu okwu amamihe.', 'approved'),
('seg-003', 'rec-002', 0, 0, 6000, 'The history of the Obi clan is rich and complex.', 'approved'),
('seg-004', 'rec-002', 1, 6001, 12000, 'It spans generations of tradition and leadership.', 'approved'),
('seg-005', 'rec-003', 0, 0, 7000, 'Àwọn ìṣe àgbẹ̀ Yorùbá àti orin ìkórè.', 'approved'),
('seg-006', 'rec-003', 1, 7001, 14000, 'Orin àwọn baba ńlá wa fún ìbùkún ilẹ̀.', 'approved'),
('seg-007', 'rec-004', 0, 0, 5500, 'The oral history of Oko Village is passed down through generations.', 'approved'),
('seg-008', 'rec-004', 1, 5501, 11000, 'Stories of our founders and their wisdom.', 'approved'),
('seg-009', 'rec-005', 0, 0, 4000, 'Chante timoun kreyòl ayisyen.', 'approved'),
('seg-010', 'rec-005', 1, 4001, 8000, 'Yo anseye valè ak tradisyon nou yo.', 'approved'),
('seg-011', 'rec-006', 0, 0, 6500, 'Contes traditionnels franco-africains.', 'approved'),
('seg-012', 'rec-006', 1, 6501, 13000, 'Des récits qui traversent les âges et les cultures.', 'approved');

INSERT INTO translations (id, segment_id, language_code, translated_text, qc_status) VALUES
('trans-001', 'seg-001', 'en', 'Ancient Igbo proverbs and their meanings.', 'approved'),
('trans-002', 'seg-002', 'en', 'Our elders speak words of wisdom.', 'approved'),
('trans-003', 'seg-005', 'en', 'Yoruba farming rites and harvest songs.', 'approved'),
('trans-004', 'seg-006', 'en', 'Our ancestors'' songs for blessing the land.', 'approved'),
('trans-005', 'seg-009', 'en', 'Haitian Creole children''s songs.', 'approved'),
('trans-006', 'seg-010', 'en', 'They teach our values and traditions.', 'approved'),
('trans-007', 'seg-011', 'en', 'Traditional French-African storytelling.', 'approved'),
('trans-008', 'seg-012', 'en', 'Stories that cross ages and cultures.', 'approved');

INSERT INTO playlists (id, title, description, visibility, owner, created_at) VALUES
('pl-001', 'Igbo Wisdom Collection', 'A curated collection of Igbo proverbs and historical narratives', 'public', 'curator-001', NOW()),
('pl-002', 'Yoruba Agricultural Heritage', 'Farming rites, harvest songs, and oral traditions of the Yoruba people', 'public', 'curator-001', NOW()),
('pl-003', 'Caribbean Voices', 'Haitian Creole songs and French-African storytelling traditions', 'public', 'curator-001', NOW());

INSERT INTO playlist_items (id, playlist_id, recording_id, item_order, created_at) VALUES
('pi-001', 'pl-001', 'rec-001', 1, NOW()),
('pi-002', 'pl-001', 'rec-002', 2, NOW()),
('pi-003', 'pl-002', 'rec-003', 1, NOW()),
('pi-004', 'pl-002', 'rec-004', 2, NOW()),
('pi-005', 'pl-003', 'rec-005', 1, NOW()),
('pi-006', 'pl-003', 'rec-006', 2, NOW());

INSERT INTO tags (id, name, created_at) VALUES
('tag-001', 'proverbs', NOW()),
('tag-002', 'wisdom', NOW()),
('tag-003', 'culture', NOW()),
('tag-004', 'history', NOW()),
('tag-005', 'lineage', NOW()),
('tag-006', 'oral tradition', NOW()),
('tag-007', 'farming', NOW()),
('tag-008', 'rituals', NOW()),
('tag-009', 'songs', NOW()),
('tag-010', 'children', NOW()),
('tag-011', 'storytelling', NOW()),
('tag-012', 'folklore', NOW());
