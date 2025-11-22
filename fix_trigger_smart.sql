-- Option 1: Drop the trigger completely (use this if you want manual control)
DROP TRIGGER IF EXISTS update_kol_overall_rate_trigger ON kols;

-- Option 2: Modify the trigger to only calculate if rate is 0 or platform rates change
-- Run this if you want smart auto-calculation
CREATE OR REPLACE FUNCTION public.update_kol_overall_rate() 
RETURNS trigger 
LANGUAGE plpgsql 
AS $function$ 
BEGIN 
  -- Only auto-calculate rate if:
  -- 1. It's a new record (INSERT), OR
  -- 2. Any platform rate was changed, OR  
  -- 3. The current rate is 0 or NULL
  IF (TG_OP = 'INSERT') OR 
     (OLD.instagram_rate IS DISTINCT FROM NEW.instagram_rate) OR
     (OLD.tiktok_rate IS DISTINCT FROM NEW.tiktok_rate) OR
     (OLD.facebook_rate IS DISTINCT FROM NEW.facebook_rate) OR
     (OLD.twitter_rate IS DISTINCT FROM NEW.twitter_rate) OR
     (OLD.thread_rate IS DISTINCT FROM NEW.thread_rate) OR
     (OLD.blog_rate IS DISTINCT FROM NEW.blog_rate) OR
     (OLD.youtube_rate IS DISTINCT FROM NEW.youtube_rate) OR
     (OLD.lemon8_rate IS DISTINCT FROM NEW.lemon8_rate) OR
     (OLD.xhs_rate IS DISTINCT FROM NEW.xhs_rate) OR
     (COALESCE(OLD.rate, 0) = 0)
  THEN
    -- Update the overall rate to be the maximum of all platform rates
    NEW.rate = GREATEST(
      COALESCE(NEW.instagram_rate, 0),
      COALESCE(NEW.tiktok_rate, 0),
      COALESCE(NEW.facebook_rate, 0),
      COALESCE(NEW.twitter_rate, 0),
      COALESCE(NEW.thread_rate, 0),
      COALESCE(NEW.blog_rate, 0),
      COALESCE(NEW.youtube_rate, 0),
      COALESCE(NEW.lemon8_rate, 0),
      COALESCE(NEW.xhs_rate, 0),
      NEW.rate  -- Keep manually set rate if it's higher
    );
  END IF;
  
  -- Update the updated_at timestamp
  NEW.updated_at = CURRENT_TIMESTAMP;
  
  RETURN NEW;
END; 
$function$;
