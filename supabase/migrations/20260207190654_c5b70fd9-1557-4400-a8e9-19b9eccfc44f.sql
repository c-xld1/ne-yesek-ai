-- Fix overly permissive RLS policies

-- 1. Fix wallets table - remove permissive UPDATE policy
DROP POLICY IF EXISTS "Wallets updatable by system" ON public.wallets;

-- Create a secure function for wallet updates (only callable by service role or edge functions)
CREATE OR REPLACE FUNCTION public.secure_update_wallet_balance(
  p_wallet_id UUID,
  p_amount NUMERIC,
  p_operation TEXT DEFAULT 'add'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_operation = 'add' THEN
    UPDATE wallets SET balance = balance + p_amount, updated_at = now() WHERE id = p_wallet_id;
  ELSIF p_operation = 'subtract' THEN
    UPDATE wallets SET balance = GREATEST(0, balance - p_amount), updated_at = now() WHERE id = p_wallet_id;
  ELSIF p_operation = 'set' THEN
    UPDATE wallets SET balance = p_amount, updated_at = now() WHERE id = p_wallet_id;
  END IF;
END;
$$;

-- Revoke direct execute from anon/authenticated - only service role can call
REVOKE EXECUTE ON FUNCTION public.secure_update_wallet_balance FROM anon, authenticated;