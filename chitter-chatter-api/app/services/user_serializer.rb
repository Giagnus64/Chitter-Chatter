class UserSerializer
    def initialize(users)
        @users = users
    end

    def to_simple_json(user, options)
        single_Json = user.to_json(options)
    end
   
end