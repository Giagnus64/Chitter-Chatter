# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Message.destroy_all

ashna = User.create(username: "ashna")
franco = User.create(username: "franco")
janet = User.create(username: "janet")

Message.create(sender:ashna, reciever:franco, content:"Hello")
Message.create(sender:ashna, reciever:franco, content:"Hello")
Message.create(sender:ashna, reciever:franco, content:"Hello")

Message.create(sender:ashna, reciever:janet, content:"Yo")
Message.create(sender:janet, reciever:franco, content:"Yawning")
Message.create(sender:janet, reciever:franco, content:"Yawning")
Message.create(sender:janet, reciever:franco, content:"Yawning")

Message.create(sender:franco, reciever:ashna, content:"Hungry")
Message.create(sender:janet, reciever:ashna, content:"Pwning")