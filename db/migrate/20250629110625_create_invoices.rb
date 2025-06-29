class CreateInvoices < ActiveRecord::Migration[8.0]
  def change
    create_table :invoices do |t|
      t.references :customer, null: false, foreign_key: true
      t.decimal :total_amount, precision: 12, scale: 2
      t.decimal :amount_paid, precision: 12, scale: 2

      t.timestamps
    end
  end
end
