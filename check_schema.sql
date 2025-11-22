-- Check kols table structure
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns 
WHERE table_name = 'kols' 
ORDER BY ordinal_position;

-- Check for triggers on kols table
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'kols';

-- Check for constraints
SELECT
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'kols';
