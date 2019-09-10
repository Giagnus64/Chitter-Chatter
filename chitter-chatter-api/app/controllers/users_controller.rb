class UsersController < ApplicationController
    def index
        users = User.all
        options = {   
            except: [:created_at, :updated_at]
        }
        render json: users.to_json(options)
    end
    
    def show
        user = User.find(params[:id])
        options = {
            include: [:recieved_messages, :sent_messages],
            except: [:created_at, :updated_at]
        }
        render json: UserSerializer.new(user).to_simple_json(user, options)
    end 

    def create
        user = User.create(allow_params)
        if user.valid?
            options = {}
            render json: UserSerializer.new(user).to_simple_json(user, options)
        else
            render json: user.errors.full_messages
        end
    end 

    def update
        user = User.find(params[:id])
        user.update(allow_params)
        if user.valid?
            options = {}
            render json: UserSerializer.new(user).to_simple_json(user, options)
        else 
            render json: user.errors.full_messages
        end
    end 

    def destroy
        user = User.find(params[:id])
        user.destroy
        render json: {message: "User was deleted"}
    end 

    private

    def allow_params()
        params.permit(:username, :icon_url)
    end 

end
