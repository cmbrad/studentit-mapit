class Location < ActiveRecord::Base
  belongs_to :site
  has_many :resources
end
