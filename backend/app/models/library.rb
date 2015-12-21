class Library < ActiveRecord::Base
  belongs_to :site

  def levels
    Level.where(library_id: self.id)
  end
end
