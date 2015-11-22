class CreateLevels < ActiveRecord::Migration
  def change
    create_table :levels do |t|
      t.references :library, index: true, foreign_key: true
      t.string :name
      t.integer :order

      t.timestamps null: false
    end
  end
end
