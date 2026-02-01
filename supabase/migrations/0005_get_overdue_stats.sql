-- Function to get aggregated overdue payment stats
-- Returns count of overdue payments and total amount due
CREATE OR REPLACE FUNCTION get_overdue_payments_stats()
RETURNS TABLE (
  count bigint,
  total_amount numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint,
    COALESCE(SUM(amount_due), 0)::numeric
  FROM payments
  WHERE status = 'overdue';
END;
$$ LANGUAGE plpgsql;
