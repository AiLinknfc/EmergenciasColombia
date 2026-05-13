-- Esquema SQL para la aplicación Emergencias Core V1.0

-- 1. Crear tabla de contactos (Unidades Operativas)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization TEXT NOT NULL,
    service_type TEXT NOT NULL,
    icon TEXT DEFAULT 'shield',
    color TEXT DEFAULT '#af101a',
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Crear tabla de teléfonos de contactos
CREATE TABLE IF NOT EXISTS public.contact_phones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
    phone_number TEXT NOT NULL,
    phone_type TEXT DEFAULT 'call',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_phones ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad (RLS) - Ajusta según necesites
-- Permitir lectura a todos (o solo autenticados si prefieres)
CREATE POLICY "Permitir lectura pública de contactos" 
ON public.contacts FOR SELECT 
USING (true);

CREATE POLICY "Permitir lectura pública de teléfonos" 
ON public.contact_phones FOR SELECT 
USING (true);

-- Permitir insertar/actualizar/eliminar solo a usuarios autenticados
CREATE POLICY "Permitir insertar a autenticados" 
ON public.contacts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir actualizar a autenticados" 
ON public.contacts FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Permitir eliminar a autenticados" 
ON public.contacts FOR DELETE 
TO authenticated 
USING (true);

-- Políticas para contact_phones
CREATE POLICY "Permitir insertar teléfonos a autenticados" 
ON public.contact_phones FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Permitir eliminar teléfonos a autenticados" 
ON public.contact_phones FOR DELETE 
TO authenticated 
USING (true);
