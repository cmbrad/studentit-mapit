class Library < ActiveRecord::Base
  belongs_to :site

  def as_json(options={})
    super(only: [:id, :name],
          methods: [:levels]
    )
  end

  def levels
    Level.where(library_id: self.id)
  end
end
