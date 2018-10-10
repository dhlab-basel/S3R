print("---- GET collections script ----")

-- Required external script files
require "./crud/collection"
require "./crud/resource"
require "./crud/file"

-- Function definitions
function getCollections()
    local table1 = {}
    table1["data"] = readAllCol({})

    if (#table1["data"] > 0) then
        table1["status"] = "successful"
    else
        table1["status"] = "no data were found"
        table1["data"] = {{}}
    end

    server.setBuffer()

    local success, jsonstr = server.table_to_json(table1)
    if not success then
        server.sendStatus(500)
        server.log(jsonstr, server.loglevel.err)
        return false
    end

    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(200)
    server.print(jsonstr)
end

function getCollection()
    local table1 = {}
    local id = string.match(uri, "%d+")
    table1["data"] = readCol(id)

    if (table1["data"] ~= nil) then
        table1["status"] = "successful"
    else
        table1["status"] = "no data were found"
        table1["data"] = {{}}
    end

    server.setBuffer()

    local success, jsonstr = server.table_to_json(table1)
    if not success then
        server.sendStatus(500)
        server.log(jsonstr, server.loglevel.err)
        return false
    end

    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(200)
    server.print(jsonstr)
end

function getChildrenCollections()
    local table1 = {}
    local colID = string.match(uri, "%d+")

    local parameter1 = { "collection_id", "EQ", colID, nil }
    local parameter2 = { "id", "!EQ", colID, nil}
    local parameters = { parameter1, parameter2 }

    table1["data"] = readAllCol(parameters)

    if (#table1["data"] > 0) then
        table1["status"] = "successful"
    else
        table1["status"] = "no data were found"
        table1["data"] = {{}}
    end

    server.setBuffer()

    local success, jsonstr = server.table_to_json(table1)
    if not success then
        server.sendStatus(500)
        server.log(jsonstr, server.loglevel.err)
        return false
    end

    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(200)
    server.print(jsonstr)
end

function getResources()
    local table1 = {}
    local colID = string.match(uri, "%d+")

    local parameter = { "collection_id", "EQ", colID, nil }
    local parameters = { parameter }
    table1["data"] = readAllRes(parameters)

    if (#table1["data"] > 0) then
        table1["status"] = "successful"
    else
        table1["status"] = "no data were found"
        table1["data"] = {{}}
    end

    server.setBuffer()

    local success, jsonstr = server.table_to_json(table1)
    if not success then
        server.sendStatus(500)
        server.log(jsonstr, server.loglevel.err)
        return false
    end

    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(200)
    server.print(jsonstr)
end

function getResource()
    local colID
    local resID

    local i, j = string.find(uri, "/collections/%d+")
    if (i ~= nil) and (j ~= nil) then
        colID = string.match(string.sub(uri, i, j), "%d+")
    end

    local k, l = string.find(uri, "/resources/%d+")
    if (k ~= nil) and (l ~= nil) then
        resID = string.match(string.sub(uri, k, l), "%d+")
    end

    local p1 = { "collection_id", "EQ", colID, nil }
    local p2 = { "id", "EQ", resID, nil }
    local parameters = { p1, p2 }

    local table1 = {}
    table1["data"] = readAllRes(parameters)[1]

    if (table1["data"] ~= nil) then
        table1["status"] = "successful"
    else
        table1["status"] = "no data were found"
        table1["data"] = {{}}
    end

    server.setBuffer()

    local success, jsonstr = server.table_to_json(table1)
    if not success then
        server.sendStatus(500)
        server.log(jsonstr, server.loglevel.err)
        return false
    end

    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(200)
    server.print(jsonstr)
end

function getFileResource()
    local colID
    local resID

    local i, j = string.find(uri, "/collections/%d+")
    if (i ~= nil) and (j ~= nil) then
        colID = string.match(string.sub(uri, i, j), "%d+")
    end

    local k, l = string.find(uri, "/resources/%d+")
    if (k ~= nil) and (l ~= nil) then
        resID = string.match(string.sub(uri, k, l), "%d+")
    end

    local p1 = { "collection_id", "EQ", colID, nil }
    local p2 = { "id", "EQ", resID, nil }
    local parameters = { p1, p2 }

    local data = readAllRes(parameters)[1]

    -- Data does not exist in the database
    if (data == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        return
    end

--    local filename = data["filename"]
--    local mimetype = data["mimetype"]
--
--    if (filename ~= nil) and (mimetype ~= nil) then
--        local fileContent = readFile(filename)
--        if (fileContent ~= nil) then
--            server.setBuffer()
--            server.sendHeader('Content-type', mimetype)
--            server.sendStatus(200)
--            server.print(fileContent)
--            return
--        else
--            print("failed to read file")
--        end
--    end

    local serverFilename = data["filename"]
    local mimetype = data["mimetype"]

    if (serverFilename == nil) or (mimetype == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(500)
        print("no file infos in data base found")
        return
    end

    local newFileName, errMsg = generateFileName(data)

    if (errMsg ~= nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(errMsg)
        print("filename on serverside is invalid")
        return
    end

    local fileContent, errMsg = readFile(serverFilename)

    if (errMsg ~= nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(errMsg)
        print("file or path does not exist")
        return
    end

    if (fileContent == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(500)
        print("failed to read file")
        return
    end

    server.setBuffer()
    server.sendHeader('Access-Control-Expose-Headers','Content-Disposition');
    server.sendHeader('Content-type', mimetype)
    server.sendHeader('Content-Disposition', "attachment; filename=" .. newFileName)
    server.sendStatus(200)
    server.print(fileContent)
    return
end

-- Checking of the url and appling the appropriate function
baseURL = "^/api"
uri = server.uri

routes = {}
routes[baseURL .. "/collections$"] = getCollections
routes[baseURL .. "/collections/%d+$"] = getCollection
routes[baseURL .. "/collections/%d+/resources$"] = getResources
routes[baseURL .. "/collections/%d+/resources/%d+$"] = getResource
routes[baseURL .. "/collections/%d+/resources/%d+/file$"] = getFileResource
routes[baseURL .. "/collections/%d+/collections$"] = getChildrenCollections

for route, func in pairs(routes) do
    if (string.match(uri, route) ~= nil) then
        func()
        return
    end
end

-- Fails if no url matches
server.sendStatus(404)