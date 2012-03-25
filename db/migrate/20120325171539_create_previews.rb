class CreatePreviews < ActiveRecord::Migration
  def up
    create_table :previews do |t|
      t.string :file_path
      t.integer :file_size
      t.timestamps
    end
  end

  def down
    remove_table :previews
  end
end
