class Api::BillingsController < ApplicationController
   skip_before_action :verify_authenticity_token
  def create
    ActiveRecord::Base.transaction do
      # Step 1: Find or create customer
      customer = Customer.find_or_create_by!(email: billing_params[:email])

      # Step 2: Calculate total with tax
      total_amount = 0.0
      items = []

      billing_params[:products].each do |item|
        product = Product.find_or_create_by!(product_id: item[:product_id])

        line_total = product.unit_price * item[:quantity].to_i
        tax_amount = line_total * (product.tax_percentage / 100.0)
        total_amount += line_total + tax_amount

        # Reduce stock
        product.update!(stock: product.stock - item[:quantity].to_i)

        items << {
          product: product,
          quantity: item[:quantity].to_i,
          unit_price: product.unit_price,
          tax_percentage: product.tax_percentage
        }
      end

      # Step 3: Create invoice
      invoice = Invoice.create!(
        customer: customer,
        total_amount: total_amount.round(2),
        amount_paid: billing_params[:amount_paid]
      )

      # Step 4: Create invoice items
      items.each do |item|
        InvoiceItem.create!(
          invoice: invoice,
          product: item[:product],
          quantity: item[:quantity],
          unit_price: item[:unit_price],
          tax_percentage: item[:tax_percentage]
        )
      end
      Delayed::Job.enqueue(SendBillJob.new(invoice))


      render json: { message: "Invoice generated successfully", invoice_id: invoice.id }, status: :created
    end


  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def products
    products = Product.all
    render json: products
  end

  def denominations
    denominations = Denomination.all
    render json: denominations
  end

  private

  def billing_params
    params.require(:billing).permit(:email, :amount_paid, products: [ :product_id, :quantity ], denominations: {})
  end
end
