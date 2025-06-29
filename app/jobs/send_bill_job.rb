SendBillJob = Struct.new(:invoice) do
  def perform
    return unless invoice
    InvoiceMailer.invoice_email(invoice: invoice).deliver_now
  end

  def destroy_failed_jobs?
    false
  end
end