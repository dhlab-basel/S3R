-------------------------------------------------------------------------------
-- Config module which includes all database and file settings for s3r
-- @module s3rConfModule
-- @author Vijeinath Tissaveerasingham
-- @release 2019/03
s3rConfModule = {
    -- Database settings
    database = {
        -- Directory where the sqlite file is located and all the metadate are stored
        dir = "testDB/test_stga_v1.db",

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
        -- Directory where the files are located
        dir = "./files/"
    }
}

return s3rConfModule
