require "./model/query"

dbPath = "testDB/testData.db"
tableName = "resource"

-------------------------------------------------------------------------------
--|                           CRUD Operations                               |--
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
-- Creates a new resource in the database
-- @param   'parameters' (table):  table with name of parameter and value
-- @return  (string): ID of the created resource
-------------------------------------------------------------------------------
function createRes(parameters)
    local db = sqlite(dbPath, "RW")
    local qry = db << insertQuery(parameters, tableName)
    local row = qry()

    qry = db << lastInsertedQuery()
    row = qry()
    --    print(table.concat(row, ", "))

    qry =~ qry;
    db =~ db;

    return row[0]
end

-------------------------------------------------------------------------------
-- Reads a resource from the database
-- @param   'id' (table): ID of the resource
-- @return  'data' (table): returns the data with dublin core fields
-------------------------------------------------------------------------------
function readRes(id)
    local db = sqlite(dbPath, "RW")
    local qry = db << selectIDQuery(id, tableName)
    local row = qry()
    local data

    if (row ~= nil) then
        -- ACHTUNG: "row[0]" IST EIGENTLICH LUA-SYNTAKTISCH FALSCH
        data = {}
        data["id"] = row[0]
        data["title"] = row[1]
        data["creator"] = row[2]
        data["subject"] = row[3]
        data["description"] = row[4]
        data["publisher"] = row[5]
        data["contributor"] = row[6]
        data["date"] = row[7]
        data["type"] = row[8]
        data["format"] = row[9]
        data["identifier"] = row[10]
        data["source"] = row[11]
        data["language"] = row[12]
        data["relation"] = row[13]
        data["coverage"] = row[14]
        data["rights"] = row[15]
        data["collection_id"] =  { ["id"] = row[16], ["url"] = "/api/collections/" .. row[16]}
        data["filename"] = row[17]
        data["mimetype"] = row[18]
        data["url"] = "/api/resources/".. row[0] .."/file"
    end

    -- delete query and free prepared statment
    qry =~ qry;
    -- delete the database connection
    db =~ db;

    return data
end

-------------------------------------------------------------------------------
-- Reads all the resources from the database
-- @param   'parameters' (table): table with name of parameter and value
-- @return  'data' (table): returns all the data with dublin core fields
-------------------------------------------------------------------------------
function readAllRes(parameters)
    local db = sqlite(dbPath, "RW")
    local trivialCond = "id!=0"

    for key, param in pairs(parameters) do

        local statement
        local paramName = param[1]
        local compOp = param[2]
        local value1 = param[3]
        local value2 = param[4]

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
        elseif (compOp == "GT") then
            statement = greaterThan(paramName, value1)
        elseif (compOp == "GT_EQ") then
            statement = greaterThanEqual(paramName, value1)
        elseif (compOp == "LT") then
            statement = lessThan(paramName, value1)
        elseif (compOp == "LT_EQ") then
            statement = lessThanEqual(paramName, value1)
        elseif (compOp == "BETWEEN") then
            statement = betweenDates(paramName, value1, value2)
        end

        trivialCond = andOperator({trivialCond, statement})
    end

    local qry = db << selectConditionQuery(trivialCond, tableName)
    local row = qry()
    local allData = {}

    while (row) do
        local data = {}
        data["id"] = row[0]
        data["title"] = row[1]
        data["creator"] = row[2]
        data["subject"] = row[3]
        data["description"] = row[4]
        data["publisher"] = row[5]
        data["contributor"] = row[6]
        data["date"] = row[7]
        data["type"] = row[8]
        data["format"] = row[9]
        data["identifier"] = row[10]
        data["source"] = row[11]
        data["language"] = row[12]
        data["relation"] = row[13]
        data["coverage"] = row[14]
        data["rights"] = row[15]
        data["collection_id"] =  { ["id"] = row[16], ["url"] = "/api/collections/" .. row[16]}
        data["filename"] = row[17]
        data["mimetype"] = row[18]
        data["url"] = "/api/resources/".. row[0] .."/file"
        table.insert(allData, data)
        row = qry()
    end

    qry =~ qry;
    db =~ db;

    return allData
end

-------------------------------------------------------------------------------
-- Reads all the resources from the database with a full text search
-- @param   'searchword' (string): word which should be looked for in all the column
-- @return  'data' (table): returns all the data with dublin core fields
-------------------------------------------------------------------------------
function readAllResFullText(searchword)
    local db = sqlite(dbPath, "RW")
    local trivialCond = "id==0"
    local statement

    local parameters = {"title", "creator", "subject", "description", "publisher", "contributor", "date", "type", "format", "identifier", "source", "language", "relation", "coverage", "rights", "collection_id", "filename", "mimetype"}

    if (searchword ~= nil) and (searchword ~= "") then
        for k, paramName in pairs(parameters) do
            statement = like(paramName, searchword)
            trivialCond = orOperator({trivialCond, statement})
        end
    else
        trivialCond = "id!=0"
    end

    local qry = db << selectConditionQuery(trivialCond, tableName)
    local row = qry()
    local allData = {}

    while (row) do
        local data = {}
        data["id"] = row[0]
        data["title"] = row[1]
        data["creator"] = row[2]
        data["subject"] = row[3]
        data["description"] = row[4]
        data["publisher"] = row[5]
        data["contributor"] = row[6]
        data["date"] = row[7]
        data["type"] = row[8]
        data["format"] = row[9]
        data["identifier"] = row[10]
        data["source"] = row[11]
        data["language"] = row[12]
        data["relation"] = row[13]
        data["coverage"] = row[14]
        data["rights"] = row[15]
        data["collection_id"] =  { ["id"] = row[16], ["url"] = "/api/collections/" .. row[16]}
        data["filename"] = row[17]
        data["mimetype"] = row[18]
        data["url"] = "/api/resources/".. row[0] .."/file"
        table.insert(allData, data)
        row = qry()
    end

    qry =~ qry;
    db =~ db;

    return allData
end

-------------------------------------------------------------------------------
-- Updates a resource from the database
-- @param   'id' (table): ID of the resource
-- @param   'parameters' (table): table with name of parameter and value
-------------------------------------------------------------------------------
function updateRes(id, parameters)
    local db = sqlite(dbPath, "RW")
    local qry = db << updateQuery(id, parameters, tableName)
    local row = qry()

    qry =~ qry;
    db =~ db;
end

-------------------------------------------------------------------------------
-- Deletes a resource from the database
-- @param   'id' (table): ID of the resource
-------------------------------------------------------------------------------
function deleteRes(id)
    local db = sqlite(dbPath, "RW")
    local qry = db << deleteQuery(id, tableName)
    local row = qry()

    qry =~ qry;
    db =~ db;
end
