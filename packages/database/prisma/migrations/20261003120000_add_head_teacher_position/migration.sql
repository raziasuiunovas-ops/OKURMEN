-- Add HEAD_TEACHER to EmployeePosition enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid  
        WHERE t.typname = 'EmployeePosition' AND e.enumlabel = 'HEAD_TEACHER'
    ) THEN
        ALTER TYPE "EmployeePosition" ADD VALUE 'HEAD_TEACHER';
    END IF;
END$$;
