class LibraryController < ApplicationController
  before_action :set_library, only: [:show]

  def index
    @libraries = Library.all

    render json: {libraries: @libraries}
  end

  def show
    render json: {libraries: @library}
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
