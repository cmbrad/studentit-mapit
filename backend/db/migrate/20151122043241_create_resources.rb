class CreateResources < ActiveRecord::Migration
  def change
    create_table :resources do |t|
      t.string :name
      t.references :location, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
