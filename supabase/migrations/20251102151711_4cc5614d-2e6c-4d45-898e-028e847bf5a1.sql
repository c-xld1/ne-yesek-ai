-- Fix handle_new_user to handle duplicate usernames gracefully
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_username text;
  v_fullname text;
  v_counter integer := 0;
BEGIN
  -- Get username and fullname from metadata
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  v_fullname := COALESCE(NEW.raw_user_meta_data->>'fullname', 'Kullanıcı');
  
  -- Make sure username is unique by appending numbers if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) LOOP
    v_counter := v_counter + 1;
    v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)) || v_counter::text;
  END LOOP;
  
  -- Insert profile with unique username
  INSERT INTO public.profiles (id, username, fullname)
  VALUES (NEW.id, v_username, v_fullname);
  
  -- Create default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;