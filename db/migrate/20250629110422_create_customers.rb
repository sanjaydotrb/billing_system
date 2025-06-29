class CreateCustomers < ActiveRecord::Migration[8.0]
  def change
    create_table :customers do |t|
      t.string :email

      t.timestamps
    end
    add_index :customers, :email
  end
end
