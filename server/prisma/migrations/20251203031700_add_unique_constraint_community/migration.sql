-- AlterTable: Add unique constraint to Community (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Community_name_zipCode_key'
    ) THEN
        ALTER TABLE "Community" ADD CONSTRAINT "Community_name_zipCode_key" UNIQUE("name", "zipCode");
    END IF;
END $$;
