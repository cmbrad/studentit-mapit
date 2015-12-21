class Level < ActiveRecord::Base
  belongs_to :library
  has_many :resources
end
