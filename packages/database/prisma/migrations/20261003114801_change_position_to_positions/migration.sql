-- AlterTable: Change position (single enum) to positions (array of enums)
-- Step 1: Add new column positions as array
ALTER TABLE "employee_profiles" ADD COLUMN "positions" "EmployeePosition"[];

-- Step 2: Copy data from position to positions array
UPDATE "employee_profiles" SET "positions" = ARRAY["position"]::("EmployeePosition"[]) WHERE "position" IS NOT NULL;

-- Step 3: Drop old position column
ALTER TABLE "employee_profiles" DROP COLUMN "position";
