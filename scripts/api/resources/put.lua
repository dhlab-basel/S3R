print("---- PUT resources script ----")

-- Required external script files
require "./crud/resource"
require "./crud/file"
require "./crud/collection"
require "./model/parameter"

-- Gets ID from the url
local id = getID("^/api/resources/%d+$")

-- ID was not found it the uri
if (id == nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(400)
    return
end

-- Gets the data from database
local data = readRes(id)

-- Data does not exist in the database
if (data == nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(404)
    return
end

-- Get parameters
local parameters, errMsg = getResParams(server.post)

-- Checks if all params are included
if (errMsg ~= nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(errMsg)
    return
end

-- Get collection
local collection = readCol(parameters["collection_id"])

-- Checks if collection exists
if (collection == nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(404)
    return
end

-- Checks if collection is a Leaf
if (collection["isLeaf"] ~= 1) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(402)
    return
end

-- Checks if resource already exists
local params = {}
table.insert(params, {"id", "!EQ", id, null })
table.insert(params, {"title", "EQ", parameters["title"], null })
table.insert(params, {"date", "EQ", parameters["date_start"], parameters["date_end"] })
table.insert(params, {"creator", "EQ", parameters["creator"], null})

if (#readAllRes(params) ~= 0) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(409)
    return
end

-- Replaces file
if (server.uploads ~= nil) then
    parameters = updateFile(parameters, data["filename"])
end

-- Updates data in database
updateRes(id, parameters)

-- Reads the data and will be added to the JSON
local table = {}
table["data"] = readRes(id)

local success, jsonstr = server.table_to_json(table)
if not success then
    server.sendStatus(500)
    server.log(jsonstr, server.loglevel.err)
    return false
end

server.sendHeader('Content-type', 'application/json')
server.sendStatus(200)
server.print(jsonstr)
