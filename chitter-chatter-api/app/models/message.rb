class Message < ApplicationRecord
    belongs_to :sender, class_name: 'User'
    belongs_to :reciever, class_name: 'User'

    validates :content, presence: true
end
