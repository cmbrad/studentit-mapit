class LibraryController < ApplicationController
  before_action :set_library, only: [:show, :levels, :resources, :map]

  def index
    @libraries = Library.all

    render json: {libraries: @libraries}
  end

  def show
    render json: {libraries: @library}
  end

  def levels
    @levels = Level.where(library: @library)
    render json: {levels: @levels}
  end

  # GET /library/<library_id>/levels/resources?level_id=<level_id>
  # See readme for sample response
  def resources
    # Display resources grouped by levels
    @levels = Level.where(library: @library)

    # Level data! Construct our custom JSON response
    lData = []
    @levels.each do |level|
      # Resource data! Need to actually return a state
      rData = []
      # Get all data for resources in this level
      level.resources.each do |resource|
        rData << {
          name: resource.bookit_name,
          state: 'AVAILABLE'
        }
      end
      # Top level, level data
      lData << {
        name: level.name,
        order: level.order,
        resources: rData
      }
    end

    # One level up the data! Bottom up approach
    data = {
      id: @library.id,
      name: @library.name,
      levels: lData
    }
    # Only JSON here no time for HTML!
    render json: data
  end

  def map
  end

  ###########
  # Private #
  ###########
  def set_library
    @library = Library.find(params[:id])
  end

  def library_params
    params.require(:library).permit(:name)
  end

  private :set_library, :library_params
end
