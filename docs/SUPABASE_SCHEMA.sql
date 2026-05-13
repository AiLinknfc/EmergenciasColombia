-- ============================================
-- Supabase Schema - Emergencias Duitama
-- ============================================
-- Este script crea todas las tablas, índices,
-- políticas RLS y funciones necesarias para
-- el proyecto de Emergencias Duitama.
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- 1. Tabla: profiles (Perfiles de usuarios)
-- Esta tabla extiende la tabla auth.users de Supabase
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'business')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla: user_emergency_data (Datos de emergencia de usuarios)
CREATE TABLE IF NOT EXISTS user_emergency_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'No especificado')),
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  emergency_contact_relationship TEXT,
  eps TEXT NOT NULL,
  medical_conditions TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Tabla: business_profiles (Perfiles de empresas)
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  nit TEXT UNIQUE,
  logo_url TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  authorization_code TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Tabla: contacts (Contactos de emergencia)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization TEXT NOT NULL,
  service_type TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla: contact_phones (Números de teléfono de contactos)
CREATE TABLE IF NOT EXISTS contact_phones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  phone_type TEXT NOT NULL CHECK (phone_type IN ('call', 'whatsapp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla: user_locations (Ubicaciones de usuarios)
CREATE TABLE IF NOT EXISTS user_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla: emergencies (Registros de emergencias)
CREATE TABLE IF NOT EXISTS emergencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'in_progress', 'resolved', 'cancelled')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_address TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla: data_policy_acceptances (Aceptación de política de datos)
CREATE TABLE IF NOT EXISTS data_policy_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  policy_version TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(user_id, policy_version)
);

-- 9. Tabla: emergency_notes (Notas en emergencias)
CREATE TABLE IF NOT EXISTS emergency_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emergency_id UUID REFERENCES emergencies(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Índices para user_emergency_data
CREATE INDEX IF NOT EXISTS idx_user_emergency_data_user_id ON user_emergency_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emergency_data_blood_type ON user_emergency_data(blood_type);

-- Índices para business_profiles
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_authorization_code ON business_profiles(authorization_code);
CREATE INDEX IF NOT EXISTS idx_business_profiles_is_verified ON business_profiles(is_verified);

-- Índices para contacts
CREATE INDEX IF NOT EXISTS idx_contacts_order_index ON contacts(order_index);
CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON contacts(created_by);

-- Índices para contact_phones
CREATE INDEX IF NOT EXISTS idx_contact_phones_contact_id ON contact_phones(contact_id);

-- Índices para user_locations
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_created_at ON user_locations(created_at DESC);

-- Índices para emergencies
CREATE INDEX IF NOT EXISTS idx_emergencies_user_id ON emergencies(user_id);
CREATE INDEX IF NOT EXISTS idx_emergencies_reporter_id ON emergencies(reporter_id);
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_created_at ON emergencies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergencies_assigned_to ON emergencies(assigned_to);

-- Índices para data_policy_acceptances
CREATE INDEX IF NOT EXISTS idx_data_policy_acceptances_user_id ON data_policy_acceptances(user_id);

-- Índices para emergency_notes
CREATE INDEX IF NOT EXISTS idx_emergency_notes_emergency_id ON emergency_notes(emergency_id);

-- Índice geoespacial para user_locations (requiere PostGIS)
CREATE INDEX IF NOT EXISTS idx_user_locations_geom ON user_locations USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- ============================================
-- TRIGGERS Y FUNCIONES
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_emergency_data_updated_at BEFORE UPDATE ON user_emergency_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergencies_updated_at BEFORE UPDATE ON emergencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_policy_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURIDAD
-- ============================================

-- Políticas para profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can update profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- Políticas para user_emergency_data
CREATE POLICY "Users can view own emergency data"
ON user_emergency_data FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own emergency data"
ON user_emergency_data FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own emergency data"
ON user_emergency_data FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all emergency data"
ON user_emergency_data FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can update emergency data"
ON user_emergency_data FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- Políticas para business_profiles
CREATE POLICY "Users can view own business profile"
ON business_profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own business profile"
ON business_profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own business profile"
ON business_profiles FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all business profiles"
ON business_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- Políticas para contacts
CREATE POLICY "Everyone can view contacts"
ON contacts FOR SELECT
USING (true);

CREATE POLICY "Admins can insert contacts"
ON contacts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can update contacts"
ON contacts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can delete contacts"
ON contacts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- Políticas para contact_phones
CREATE POLICY "Everyone can view contact phones"
ON contact_phones FOR SELECT
USING (true);

CREATE POLICY "Admins can insert contact phones"
ON contact_phones FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can update contact phones"
ON contact_phones FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can delete contact phones"
ON contact_phones FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- Políticas para user_locations
CREATE POLICY "Users can view own locations"
ON user_locations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own locations"
ON user_locations FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all locations"
ON user_locations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- Políticas para emergencies
CREATE POLICY "Users can view own emergencies"
ON emergencies FOR SELECT
USING (user_id = auth.uid() OR reporter_id = auth.uid());

CREATE POLICY "Users can insert emergencies"
ON emergencies FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can view all emergencies"
ON emergencies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can insert emergencies"
ON emergencies FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can update emergencies"
ON emergencies FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can delete emergencies"
ON emergencies FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- Políticas para data_policy_acceptances
CREATE POLICY "Users can view own policy acceptances"
ON data_policy_acceptances FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own policy acceptances"
ON data_policy_acceptances FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Políticas para emergency_notes
CREATE POLICY "Users can view notes in accessible emergencies"
ON emergency_notes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM emergencies e
    WHERE e.id = emergency_notes.emergency_id
    AND (e.user_id = auth.uid() OR e.reporter_id = auth.uid() OR e.assigned_to = auth.uid())
  )
);

CREATE POLICY "Admins can view all emergency notes"
ON emergency_notes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

CREATE POLICY "Admins can insert emergency notes"
ON emergency_notes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'business'
  )
);

-- ============================================
-- DATOS INICIALES (SEED DATA)
-- ============================================

-- Insertar contactos de emergencia iniciales
INSERT INTO contacts (organization, service_type, icon, color, order_index) VALUES
  ('Policía Nacional', 'Línea de emergencia', 'star', '#16a34a', 1),
  ('Bomberos Duitama', 'Emergencias', 'flame', '#dc2626', 2),
  ('Cruz Roja', 'Emergencias médicas', 'cross', '#ef4444', 3),
  ('Defensa Civil', 'Emergencia general', 'shield', '#f97316', 4),
  ('Asotraind Taxis', 'Transporte seguro', 'car', '#eab308', 5),
  ('Hospital Regional', 'Urgencias 24/7', 'hospital', '#0ea5e9', 6),
  ('Empoduitama', 'Acueducto y alcant.', 'drop', '#6b7280', 7),
  ('EBSA Energía', 'Emergencias eléctr.', 'bolt', '#fbbf24', 8)
ON CONFLICT DO NOTHING;

-- Insertar números de teléfono para los contactos
INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  unnest(ARRAY['123', '314 317 6387']),
  'call'
FROM contacts c
WHERE c.organization = 'Policía Nacional'
ON CONFLICT DO NOTHING;

INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  unnest(ARRAY['119', '760 2749']),
  'call'
FROM contacts c
WHERE c.organization = 'Bomberos Duitama'
ON CONFLICT DO NOTHING;

INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  '313 300 7105',
  'call'
FROM contacts c
WHERE c.organization = 'Cruz Roja'
ON CONFLICT DO NOTHING;

INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  '322 793 8103',
  'call'
FROM contacts c
WHERE c.organization = 'Defensa Civil'
ON CONFLICT DO NOTHING;

INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  unnest(ARRAY['310 695 1743', '310 695 1743']),
  unnest(ARRAY['call', 'whatsapp'])
FROM contacts c
WHERE c.organization = 'Asotraind Taxis'
ON CONFLICT DO NOTHING;

INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  '760 3900',
  'call'
FROM contacts c
WHERE c.organization = 'Hospital Regional'
ON CONFLICT DO NOTHING;

INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  '760 5050',
  'call'
FROM contacts c
WHERE c.organization = 'Empoduitama'
ON CONFLICT DO NOTHING;

INSERT INTO contact_phones (contact_id, phone_number, phone_type)
SELECT 
  c.id,
  '018000 919 101',
  'call'
FROM contacts c
WHERE c.organization = 'EBSA Energía'
ON CONFLICT DO NOTHING;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: contactos con sus números de teléfono
CREATE OR REPLACE VIEW contacts_with_phones AS
SELECT 
  c.id,
  c.organization,
  c.service_type,
  c.icon,
  c.color,
  c.order_index,
  c.created_at,
  json_agg(
    json_build_object(
      'id', cp.id,
      'phone_number', cp.phone_number,
      'phone_type', cp.phone_type
    ) ORDER BY cp.id
  ) AS phones
FROM contacts c
LEFT JOIN contact_phones cp ON c.id = cp.contact_id
GROUP BY c.id
ORDER BY c.order_index;

-- Vista: usuarios con datos de emergencia
CREATE OR REPLACE VIEW users_with_emergency_data AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.avatar_url,
  ued.address,
  ued.blood_type,
  ued.emergency_contact_name,
  ued.emergency_contact_phone,
  ued.emergency_contact_relationship,
  ued.eps,
  ued.medical_conditions,
  ued.allergies,
  p.created_at
FROM profiles p
LEFT JOIN user_emergency_data ued ON p.id = ued.user_id
WHERE p.role = 'user';

-- Vista: empresas con perfiles
CREATE OR REPLACE VIEW businesses_with_profiles AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  bp.company_name,
  bp.nit,
  bp.logo_url,
  bp.description,
  bp.address,
  bp.phone,
  bp.is_verified,
  p.created_at
FROM profiles p
INNER JOIN business_profiles bp ON p.id = bp.user_id
WHERE p.role = 'business';

-- Vista: emergencias con información de usuarios
CREATE OR REPLACE VIEW emergencies_with_details AS
SELECT 
  e.id,
  e.type,
  e.description,
  e.status,
  e.location_lat,
  e.location_lng,
  e.location_address,
  e.created_at,
  e.resolved_at,
  json_build_object(
    'id', u.id,
    'name', u.full_name,
    'email', u.email
  ) AS user,
  json_build_object(
    'id', r.id,
    'name', r.full_name
  ) AS reporter,
  json_build_object(
    'id', a.id,
    'name', a.full_name
  ) AS assigned_to
FROM emergencies e
LEFT JOIN profiles u ON e.user_id = u.id
LEFT JOIN profiles r ON e.reporter_id = r.id
LEFT JOIN profiles a ON e.assigned_to = a.id
ORDER BY e.created_at DESC;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
