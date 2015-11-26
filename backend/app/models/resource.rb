class Resource < ActiveRecord::Base
  belongs_to :location
  belongs_to :level
end
