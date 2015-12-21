class Resource < ActiveRecord::Base
  belongs_to :location
  belongs_to :level

  def as_json(options={})
    super(only: [:id, :bookit_name, :location_id])
  end
end
