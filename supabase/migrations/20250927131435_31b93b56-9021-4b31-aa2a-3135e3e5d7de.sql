-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for better type safety
CREATE TYPE user_role AS ENUM ('admin', 'patient');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'expense');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'credit_card', 'insurance');

-- Clinics table for multi-tenancy
CREATE TABLE public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, clinic_id)
);

-- Patients table (detailed patient information)
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    patient_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    medical_history TEXT,
    allergies TEXT,
    insurance_provider TEXT,
    insurance_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Treatments table (services offered)
CREATE TABLE public.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 60,
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    dentist_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Appointment treatments (many-to-many relationship)
CREATE TABLE public.appointment_treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
    treatment_id UUID REFERENCES public.treatments(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(appointment_id, treatment_id)
);

-- Inventory table
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT,
    brand TEXT,
    supplier TEXT,
    current_stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2),
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    transaction_type transaction_type NOT NULL,
    payment_method payment_method,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    transaction_date DATE DEFAULT CURRENT_DATE,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_clinic_id ON public.profiles(clinic_id);
CREATE INDEX idx_user_roles_user_clinic ON public.user_roles(user_id, clinic_id);
CREATE INDEX idx_patients_clinic_id ON public.patients(clinic_id);
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_treatments_clinic_id ON public.treatments(clinic_id);
CREATE INDEX idx_appointments_clinic_id ON public.appointments(clinic_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_inventory_clinic_id ON public.inventory(clinic_id);
CREATE INDEX idx_transactions_clinic_id ON public.transactions(clinic_id);
CREATE INDEX idx_transactions_appointment_id ON public.transactions(appointment_id);

-- Enable Row Level Security
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_clinic_id(user_uuid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT clinic_id FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_clinic_role(user_uuid UUID, clinic_uuid UUID, required_role user_role)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND clinic_id = clinic_uuid 
    AND role = required_role
  );
$$;

-- RLS Policies for clinics
CREATE POLICY "Users can view their clinic" ON public.clinics
    FOR SELECT USING (id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Admins can update their clinic" ON public.clinics
    FOR UPDATE USING (public.has_clinic_role(auth.uid(), id, 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their clinic" ON public.profiles
    FOR SELECT USING (clinic_id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (id = auth.uid() AND clinic_id = public.get_user_clinic_id(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles in their clinic" ON public.user_roles
    FOR SELECT USING (clinic_id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Admins can manage roles in their clinic" ON public.user_roles
    FOR ALL USING (public.has_clinic_role(auth.uid(), clinic_id, 'admin'));

-- RLS Policies for patients
CREATE POLICY "Users can view patients in their clinic" ON public.patients
    FOR SELECT USING (clinic_id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Admins can manage patients in their clinic" ON public.patients
    FOR ALL USING (public.has_clinic_role(auth.uid(), clinic_id, 'admin'));

CREATE POLICY "Patients can view their own record" ON public.patients
    FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for treatments
CREATE POLICY "Users can view treatments in their clinic" ON public.treatments
    FOR SELECT USING (clinic_id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Admins can manage treatments in their clinic" ON public.treatments
    FOR ALL USING (public.has_clinic_role(auth.uid(), clinic_id, 'admin'));

-- RLS Policies for appointments
CREATE POLICY "Users can view appointments in their clinic" ON public.appointments
    FOR SELECT USING (clinic_id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Admins can manage appointments in their clinic" ON public.appointments
    FOR ALL USING (public.has_clinic_role(auth.uid(), clinic_id, 'admin'));

CREATE POLICY "Patients can view their own appointments" ON public.appointments
    FOR SELECT USING (patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()));

-- RLS Policies for appointment_treatments
CREATE POLICY "Users can view appointment treatments in their clinic" ON public.appointment_treatments
    FOR SELECT USING (appointment_id IN (SELECT id FROM public.appointments WHERE clinic_id = public.get_user_clinic_id(auth.uid())));

CREATE POLICY "Admins can manage appointment treatments in their clinic" ON public.appointment_treatments
    FOR ALL USING (appointment_id IN (SELECT id FROM public.appointments WHERE public.has_clinic_role(auth.uid(), clinic_id, 'admin')));

-- RLS Policies for inventory
CREATE POLICY "Users can view inventory in their clinic" ON public.inventory
    FOR SELECT USING (clinic_id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Admins can manage inventory in their clinic" ON public.inventory
    FOR ALL USING (public.has_clinic_role(auth.uid(), clinic_id, 'admin'));

-- RLS Policies for transactions
CREATE POLICY "Users can view transactions in their clinic" ON public.transactions
    FOR SELECT USING (clinic_id = public.get_user_clinic_id(auth.uid()));

CREATE POLICY "Admins can manage transactions in their clinic" ON public.transactions
    FOR ALL USING (public.has_clinic_role(auth.uid(), clinic_id, 'admin'));

-- Function to generate patient numbers
CREATE OR REPLACE FUNCTION public.generate_patient_number(clinic_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    clinic_prefix TEXT;
    next_number INTEGER;
    patient_number TEXT;
BEGIN
    -- Get clinic prefix (first 3 letters of clinic name, uppercase)
    SELECT UPPER(LEFT(REGEXP_REPLACE(name, '[^A-Za-z]', '', 'g'), 3))
    INTO clinic_prefix
    FROM public.clinics
    WHERE id = clinic_uuid;
    
    -- Get next patient number for this clinic
    SELECT COALESCE(MAX(CAST(SUBSTRING(patient_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.patients
    WHERE clinic_id = clinic_uuid;
    
    -- Format: CLN001, CLN002, etc.
    patient_number := clinic_prefix || LPAD(next_number::TEXT, 3, '0');
    
    RETURN patient_number;
END;
$$;

-- Trigger to auto-generate patient numbers
CREATE OR REPLACE FUNCTION public.set_patient_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.patient_number IS NULL OR NEW.patient_number = '' THEN
        NEW.patient_number := public.generate_patient_number(NEW.clinic_id);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_patient_number
    BEFORE INSERT ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.set_patient_number();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Add update triggers for tables with updated_at columns
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON public.clinics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON public.treatments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for development
INSERT INTO public.clinics (id, name, address, phone, email) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'Bright Smiles Dental Clinic', '123 Main St, City, State 12345', '+1-555-0123', 'info@brightsmiles.com');

-- Insert sample treatments
INSERT INTO public.treatments (clinic_id, name, description, duration_minutes, price) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'General Checkup', 'Routine dental examination and cleaning', 60, 120.00),
('123e4567-e89b-12d3-a456-426614174000', 'Teeth Cleaning', 'Professional dental cleaning and polishing', 45, 80.00),
('123e4567-e89b-12d3-a456-426614174000', 'Root Canal', 'Root canal treatment for infected tooth', 90, 450.00),
('123e4567-e89b-12d3-a456-426614174000', 'Filling', 'Dental filling for cavity treatment', 30, 150.00),
('123e4567-e89b-12d3-a456-426614174000', 'Tooth Extraction', 'Surgical removal of damaged tooth', 45, 200.00);

-- Insert sample inventory
INSERT INTO public.inventory (clinic_id, item_name, category, current_stock, minimum_stock, unit_cost) VALUES 
('123e4567-e89b-12d3-a456-426614174000', 'Disposable Gloves', 'Safety Equipment', 500, 50, 0.25),
('123e4567-e89b-12d3-a456-426614174000', 'Dental Masks', 'Safety Equipment', 200, 25, 0.15),
('123e4567-e89b-12d3-a456-426614174000', 'Composite Filling Material', 'Materials', 20, 5, 45.00),
('123e4567-e89b-12d3-a456-426614174000', 'Local Anesthetic', 'Medications', 15, 3, 12.50),
('123e4567-e89b-12d3-a456-426614174000', 'Dental Needles', 'Equipment', 100, 20, 2.00);