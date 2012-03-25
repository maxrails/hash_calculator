class FingerprintsController < ApplicationController

  def match
    respond_to do |format|
      format.json do
        render :json => {:result => false}
      end
    end
  end

end
