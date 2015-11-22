class CreateMapCoordinates < ActiveRecord::Migration
  def change
    create_table :map_coordinates do |t|
      t.references :resource, index: true, foreign_key: true
      t.integer :x
      t.integer :y

      t.timestamps null: false
    end
  end
end
