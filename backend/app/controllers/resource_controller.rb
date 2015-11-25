class ResourceController < ApplicationController
  before_action :set_resource, only: [:show]

  def index
    @resources= Resource.all

    render json: {resources: @resources}
  end

  def show
    render json: {resources: @resource}
  end

  ###########
  # Private #
  ###########
  def set_resource
    @resource = Resource.find(params[:id])
  end

  def resource_params 
    params.require(:resource).permit(:name)
  end

  private :set_resource, :resource_params
end
