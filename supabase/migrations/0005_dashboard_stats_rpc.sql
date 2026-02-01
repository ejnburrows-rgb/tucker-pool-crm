-- Create RPC to get dashboard stats efficiently
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  total_clients integer;
  active_clients integer;
  total_revenue numeric;
  paid_payments integer;
  pending_payments integer;
  overdue_payments integer;
  work_revenue numeric;
  completed_work integer;
  pending_work integer;
BEGIN
  -- Clients
  SELECT count(*) INTO total_clients FROM clients;
  SELECT count(*) INTO active_clients FROM clients WHERE is_active = true;

  -- Payments
  SELECT
    COALESCE(SUM(amount_paid), 0),
    COUNT(*) FILTER (WHERE status = 'paid'),
    COUNT(*) FILTER (WHERE status = 'pending'),
    COUNT(*) FILTER (WHERE status = 'overdue')
  INTO
    total_revenue,
    paid_payments,
    pending_payments,
    overdue_payments
  FROM payments;

  -- Additional Work
  SELECT
    COALESCE(SUM(amount_paid), 0),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'pending')
  INTO
    work_revenue,
    completed_work,
    pending_work
  FROM additional_work;

  RETURN json_build_object(
    'totalClients', total_clients,
    'activeClients', active_clients,
    'totalRevenue', total_revenue,
    'monthlyRevenue', total_revenue, -- Preserving existing logic where monthlyRevenue uses totalRevenue
    'paidPayments', paid_payments,
    'pendingPayments', pending_payments,
    'overduePayments', overdue_payments,
    'workRevenue', work_revenue,
    'completedWork', completed_work,
    'pendingWork', pending_work
  );
END;
$$;
