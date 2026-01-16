-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- Stand-Planet - Supabase PostgreSQL
-- ============================================

-- Ce fichier contient toutes les policies de sécurité
-- pour les tables de Stand-Planet

-- IMPORTANT: Exécuter ce fichier APRÈS avoir créé les tables
-- Dashboard > SQL Editor > Coller ce fichier > Run

-- ============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. USERS TABLE POLICIES
-- ============================================

-- Policy: Tout le monde peut lire les profils publics
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Policy: Les utilisateurs peuvent mettre à jour leur propre profil
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Seuls les admins peuvent créer des users (ou self-registration via Supabase Auth)
DROP POLICY IF EXISTS "Only admins can create users" ON users;
CREATE POLICY "Only admins can create users"
  ON users FOR INSERT
  WITH CHECK (
    (auth.jwt() ->> 'role' = 'admin')
    OR (auth.uid() = id)  -- Allow self-registration
  );

-- Policy: Seuls les admins peuvent supprimer des users
DROP POLICY IF EXISTS "Only admins can delete users" ON users;
CREATE POLICY "Only admins can delete users"
  ON users FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- 3. EVENTS TABLE POLICIES
-- ============================================

-- Policy: Tout le monde peut lire les events publiés
-- Les organisateurs peuvent voir leurs propres events (même draft)
DROP POLICY IF EXISTS "Published events are viewable by everyone" ON events;
CREATE POLICY "Published events are viewable by everyone"
  ON events FOR SELECT
  USING (
    status = 'published'
    OR organizer_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- Policy: Seuls les utilisateurs authentifiés peuvent créer des events
DROP POLICY IF EXISTS "Authenticated users can create events" ON events;
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

-- Policy: Seuls les organisateurs peuvent modifier leurs events
DROP POLICY IF EXISTS "Organizers can update own events" ON events;
CREATE POLICY "Organizers can update own events"
  ON events FOR UPDATE
  USING (
    organizer_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- Policy: Seuls les organisateurs peuvent supprimer leurs events
DROP POLICY IF EXISTS "Organizers can delete own events" ON events;
CREATE POLICY "Organizers can delete own events"
  ON events FOR DELETE
  USING (
    organizer_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- ============================================
-- 4. BOOTHS TABLE POLICIES
-- ============================================

-- Policy: Les stands sont visibles par leur propriétaire, participants de l'event, et admins
DROP POLICY IF EXISTS "Users can view accessible booths" ON booths;
CREATE POLICY "Users can view accessible booths"
  ON booths FOR SELECT
  USING (
    user_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
    OR EXISTS (
      SELECT 1 FROM events
      WHERE events.id = booths.event_id
      AND events.status = 'published'
    )
  );

-- Policy: Les utilisateurs authentifiés peuvent créer des stands
DROP POLICY IF EXISTS "Authenticated users can create booths" ON booths;
CREATE POLICY "Authenticated users can create booths"
  ON booths FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Les propriétaires peuvent modifier leurs stands
DROP POLICY IF EXISTS "Users can update own booths" ON booths;
CREATE POLICY "Users can update own booths"
  ON booths FOR UPDATE
  USING (
    user_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- Policy: Les propriétaires peuvent supprimer leurs stands
DROP POLICY IF EXISTS "Users can delete own booths" ON booths;
CREATE POLICY "Users can delete own booths"
  ON booths FOR DELETE
  USING (
    user_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- ============================================
-- 5. ORDERS TABLE POLICIES
-- ============================================

-- Policy: Les commandes sont visibles par leur propriétaire et les admins
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    user_id = auth.uid()
    OR (auth.jwt() ->> 'role' = 'admin')
  );

-- Policy: Les utilisateurs authentifiés peuvent créer des commandes
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Seuls les admins peuvent modifier les commandes (statut, montant)
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Policy: Seuls les admins peuvent supprimer des commandes
DROP POLICY IF EXISTS "Only admins can delete orders" ON orders;
CREATE POLICY "Only admins can delete orders"
  ON orders FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- 6. STORAGE POLICIES
-- ============================================

-- BUCKET: public
-- Tout le monde peut lire, seuls auth peuvent upload/update/delete

DROP POLICY IF EXISTS "Public files are publicly accessible" ON storage.objects;
CREATE POLICY "Public files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public');

DROP POLICY IF EXISTS "Authenticated users can upload to public" ON storage.objects;
CREATE POLICY "Authenticated users can upload to public"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public');

DROP POLICY IF EXISTS "Users can update own public files" ON storage.objects;
CREATE POLICY "Users can update own public files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own public files" ON storage.objects;
CREATE POLICY "Users can delete own public files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- BUCKET: private
-- Seul le propriétaire (dossier nommé par user_id) peut accéder

DROP POLICY IF EXISTS "Users can view own private files" ON storage.objects;
CREATE POLICY "Users can view own private files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'private'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can upload to own private folder" ON storage.objects;
CREATE POLICY "Users can upload to own private folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'private'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update own private files" ON storage.objects;
CREATE POLICY "Users can update own private files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'private'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own private files" ON storage.objects;
CREATE POLICY "Users can delete own private files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'private'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- BUCKET: avatars (optionnel)
-- Tout le monde peut lire, seuls auth peuvent upload leur propre avatar

DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function: Vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'role' = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Vérifier si l'utilisateur possède une ressource
CREATE OR REPLACE FUNCTION owns_resource(resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.uid() = resource_user_id OR is_admin());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. VERIFICATION
-- ============================================

-- Vérifier que RLS est activé
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'events', 'booths', 'orders');

-- Résultat attendu: rowsecurity = true pour toutes les tables

-- ============================================
-- FIN DU FICHIER
-- ============================================

-- Pour tester les policies:
-- 1. Créer un utilisateur test dans Auth
-- 2. Obtenir son JWT token
-- 3. Faire des requêtes avec ce token
-- 4. Vérifier que seules les données autorisées sont accessibles

-- Exemple de test:
-- SELECT * FROM users; -- Devrait retourner tous les users (policy SELECT)
-- UPDATE users SET full_name = 'Test' WHERE id = auth.uid(); -- Devrait fonctionner
-- UPDATE users SET full_name = 'Test' WHERE id != auth.uid(); -- Devrait échouer
