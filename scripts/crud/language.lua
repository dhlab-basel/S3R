require "./model/query"

dbPath = "testDB/test_stga_v1.db"
langTable = "language"

-------------------------------------------------------------------------------
--|                           CRUD Operations                               |--
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
-- Creates a new language in the database
-- @param   'parameters' (table):  table with name of parameter and value
-- @return  (string): ID of the created language
-------------------------------------------------------------------------------
function createLang(parameters)
    local db = sqlite(dbPath, "RW")
    local qry = db << insertQuery(parameters, langTable)
    local row = qry()

    qry = db << lastInsertedQuery()
    row = qry()

    qry =~ qry;
    db =~ db;

    return row[0]
end

-------------------------------------------------------------------------------
-- Reads a language from the database
-- @param   'id' (table): ID of the language
-- @return  'data' (table): returns the data of the language
-------------------------------------------------------------------------------
function readLang(id)
    local db = sqlite(dbPath, "RW")
    local qry = db << selectIDQuery(id, langTable)
    local row = qry()
    local data

    if (row ~= nil) then
        -- ACHTUNG: "row[0]" IST EIGENTLICH LUA-SYNTAKTISCH FALSCH
        data = {}
        data["id"] = row[0]
        data["name"] = row[1]
        data["resource_id"] =  { ["id"] = row[2], ["url"] = "/api/resources/" .. row[2]}
    end

    -- delete query and free prepared statment
    qry =~ qry;
    -- delete the database connection
    db =~ db;

    return data
end

-------------------------------------------------------------------------------
-- Reads all the languages from the database
-- @param   'parameters' (table): table with name of parameter and value
-- @return  'data' (table): returns all the languages
-------------------------------------------------------------------------------
function readAllLang(parameters)
    local db = sqlite(dbPath, "RW")
    local trivialCond = "id!=0"

    for key, param in pairs(parameters) do

        local statement
        local paramName = param[1]
        local compOp = param[2]
        local value1 = param[3]

        if (compOp == "EQ") then
            statement = equal(paramName, value1)
        elseif (compOp == "!EQ") then
            statement = notEqual(paramName, value1)
        elseif (compOp == "LIKE") then
            statement = like(paramName, value1)
        elseif (compOp == "!LIKE") then
            statement = notLike(paramName, value1)
        elseif (compOp == "NULL") then
            statement = isNull(paramName)
        elseif (compOp == "!NULL") then
            statement = isNotNull(paramName)
        end

        trivialCond = andOperator({trivialCond, statement})
    end

    local qry = db << selectConditionQuery(trivialCond, langTable)
    local row = qry()
    local allData = {}

    while (row) do
        local data = {}
        data["id"] = row[0]
        data["name"] = row[1]
        data["resource_id"] =  { ["id"] = row[2], ["url"] = "/api/resources/" .. row[2]}
        table.insert(allData, data)
        row = qry()
    end

    qry =~ qry;
    db =~ db;

    return allData
end

-------------------------------------------------------------------------------
-- Updates a language from the database
-- @param   'id' (table): ID of the language
-- @param   'parameters' (table): table with name of parameter and value
-------------------------------------------------------------------------------
function updateLang(id, parameters)
    local db = sqlite(dbPath, "RW")
    local qry = db << updateQuery(id, parameters, langTable)
    local row = qry()

    qry =~ qry;
    db =~ db;
end

-------------------------------------------------------------------------------
-- Deletes a language from the database
-- @param   'id' (table): ID of the language
-------------------------------------------------------------------------------
function deleteLang(id)
    local db = sqlite(dbPath, "RW")
    local qry = db << deleteQuery(id, langTable)
    local row = qry()

    qry =~ qry;
    db =~ db;
end