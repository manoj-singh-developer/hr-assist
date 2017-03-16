class ChangeDatabaseCharset < ActiveRecord::Migration[5.0]
    def self.up
        execute "ALTER DATABASE `#{ActiveRecord::Base.connection.current_database}` CHARACTER SET utf8 COLLATE utf8_general_ci;"
    end
end
