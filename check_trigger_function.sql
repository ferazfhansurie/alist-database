-- Get the trigger function definition
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'update_kol_overall_rate';

-- Alternative if above doesn't work:
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'update_kol_overall_rate';
