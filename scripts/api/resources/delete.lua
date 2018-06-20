print("---- DELETE resources script ----")

-- Required external script files
require "./model/resource"
require "./model/parameter"
require "./model/file"

-- Gets ID from the url
local id = getID("^/api/resources/%d+$")

-- ID was not found it the url
if (id == nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(400)
    return
end

-- Gets the data with the id
local data = readRes(id)

-- ID not in the database
if (data == nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(404)
    return
end

-- Deletes file and metadata
deleteFile(data["filename"])
deleteRes(id)

-- ID still exists and delete failed
if (readRes(id) ~= nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(500)
    return
end

local table = {}
table["status"] = "successful"

local success, jsonstr = server.table_to_json(table)
if not success then
    server.sendStatus(500)
    server.log(jsonstr, server.loglevel.err)
    return false
end

server.sendHeader('Content-type', 'application/json')
server.sendStatus(200)
server.print(jsonstr)
