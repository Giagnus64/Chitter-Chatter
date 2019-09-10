class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :username
      t.string :icon_url, default: "https://www.writeups.org/wp-content/uploads/Harry-Potter-Philosopher-Stone-era.jpg"

      t.timestamps
    end
  end
end
