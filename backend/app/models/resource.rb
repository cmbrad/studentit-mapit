class Resource < ActiveRecord::Base
  belongs_to :location
  belongs_to :level

  def as_json(options={})
    super(only: [:id, :bookit_name, :location_id, :level_id],
          methods: [:library_id, :state])
  end

  def library_id
    if not self.level.nil?
      self.level.library_id
    end
  end

  def state
    "AVAILABLE"
  end
end
