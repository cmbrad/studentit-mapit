class Level < ActiveRecord::Base
  belongs_to :library
  has_many :resources

  def as_json(options={})
    super(only: [:name, :order])
  end
end
