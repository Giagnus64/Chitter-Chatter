class UserSerializer
    def initialize(users)
        @users = users
    end

    def to_simple_json(user, options)
        single_Json = user.to_json(options)
    end

    def json_multiple_users(options)
        master_json = []
        @users.each do |user|
            single_Json = self.to_simple_json(user, options)
            master_json << single_Json
        end
        return master_json
    end
   
end