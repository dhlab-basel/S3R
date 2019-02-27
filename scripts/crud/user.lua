require "./model/query"

dbPath = "testDB/test_stga_v1.db"
userTable = "user"

-------------------------------------------------------------------------------
--|                           CRUD Operations                               |--
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
-- Reads a user from the database
-- @param   'name' (table): name of the user
-- @return  'pwd' (table): returns the password
-------------------------------------------------------------------------------
function readUser(name)
    local condition = equal("name", name)

    local db = sqlite(dbPath, "RW")
    local qry = db << selectConditionQuery(condition, userTable)
    local row = qry()
    local data

    if (row ~= nil) then
        -- ACHTUNG: "row[0]" IST EIGENTLICH LUA-SYNTAKTISCH FALSCH
        data = {}
        data["id"] = row[0]
        data["name"] = row[1]
        data["pwd"] = row[2]
    end

    -- delete query and free prepared statment
    qry =~ qry;
    -- delete the database connection
    db =~ db;

    return data
end