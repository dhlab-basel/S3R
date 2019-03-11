-------------------------------------------------------------------------------
-- Config module which includes all database and file settings for s3r
-- @module s3rConfModule
-- @author Vijeinath Tissaveerasingham
-- @release 2019/03
s3rConfModule = {
    -- Database settings
    database = {
        -- Path where the sqlite file is located. This file contains all the metadate of the files
        path = "testDB/test_stga_v1.db",

        -- Resource table name in the sqliteDB
        resTable = "resource",

        -- Collection table name in the sqliteDB
        colTable = "collection",

        -- Language table name in the sqliteDB
        langTable = "language",

        -- User table name in the sqliteDB
        userTable = "user"
    },

    -- File settings
    files = {
        -- Directory where the files are located. The files all have a generated filename
        dir = "./files/"
    }
}

return s3rConfModule
