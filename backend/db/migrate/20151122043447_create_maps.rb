class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.references :level, index: true, foreign_key: true
      t.string :filename
      t.string :name

      t.timestamps null: false
    end
  end
end
