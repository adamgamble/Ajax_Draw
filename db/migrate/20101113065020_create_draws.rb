class CreateDraws < ActiveRecord::Migration
  def self.up
    create_table :draws do |t|
      t.integer :x
      t.integer :y
      t.string :color

      t.timestamps
    end
  end

  def self.down
    drop_table :draws
  end
end
