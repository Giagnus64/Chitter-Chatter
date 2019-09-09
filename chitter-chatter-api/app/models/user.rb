class User < ApplicationRecord
    has_many :sent_messages, foreign_key: :sender_id, class_name: 'Message', dependent: :destroy

    has_many :recievers, through: :sent_messages
    
    #if User was "Jack"
    #line 3 shows all the users Jack has ever sent a message to

    has_many :recieved_messages, foreign_key: :reciever_id, class_name: 'Message', dependent: :destroy
    has_many :senders, through: :recieved_messages
    #if User was "Jack"
    #line 8 shows all the users Jack has ever recieved a message from

    validates :username, presence: true, uniqueness: true
end
