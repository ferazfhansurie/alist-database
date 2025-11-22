-- Drop the trigger that's overriding the rate field
DROP TRIGGER IF EXISTS update_kol_overall_rate_trigger ON kols;

-- If you want to keep the function but remove the trigger, use above
-- If you want to remove the function too:
-- DROP FUNCTION IF EXISTS update_kol_overall_rate();
