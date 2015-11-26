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

  def resources
    @levels = Level.where(library: @library)
    @levels.each do |level|
      #level.
    end
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
