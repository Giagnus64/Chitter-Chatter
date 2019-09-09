class MessagesController < ApplicationController
    def create
       message = Message.create(allow_params)
       options = {

       } 
       render json: message
    end

    def destroy
       message = Message.find(params[:id])
       message.destroy()
       render json: { "message": "Message was deleted!"}
    end

    private

    def allow_params
        params.permit(:content, :sender_id, :reciever_id)
    end
end
