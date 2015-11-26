class AddLevelToResource < ActiveRecord::Migration
  def change
    add_reference :resources, :level, index: true, foreign_key: true
  end
end
