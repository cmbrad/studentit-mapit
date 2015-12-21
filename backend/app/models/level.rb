class Level < ActiveRecord::Base
  belongs_to :library
  has_many :resources

  def as_json(options={})
    super(only: [:id, :name, :order],
          methods: [:resources])
  end

  def resources
    Resource.where(level_id: self.id)
  end
end
