print("---- GET resources script ----")

-- Required external script files
require "./crud/resource"
require "./crud/file"
require "./model/parameter"

-- Constant
thumbnail = {
    small  = {height = 100},
    medium = {height = 140},
    large  = {height = 200}
}

thumbnailSquare = false;

preview = {height = 600}

function getDublinCoreXML(data)
    local content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" .. "\n" .. "<metadata>" .. "\n"
    local paramList = {
        "title",
        "creator",
        "subject",
        "description",
        "publisher",
        "contributor",
        "date",
        "format",
        "identifier",
        "source",
        "language",
        "relation",
        "coverage",
        "rights"
    }

    local temp
    for key, value in pairs(paramList) do
        if (value == "date") then
            if ((data["date_start"] ~= nil) and (data["date_end"] ~= nil)) then
                print(type(data["date_end"]))
                if ((data["date_start"] == data["date_end"])) then
                    temp = content .. "\t" .. "<dc:".. value .. ">" .. data["date_start"]  .. "</dc:" .. value .. ">" .. "\n"
                else
                    temp = content .. "\t" .. "<dc:".. value .. ">start=" .. data["date_start"]  .. ";end=".. data["date_end"] .. "</dc:" .. value .. ">" .. "\n"
                end
            else
                temp = content .. "\t" .. "<dc:".. value .. "></dc:" .. value .. ">" .. "\n"
            end
        elseif (data[value] ~= nil) then
            temp = content .. "\t" .. "<dc:".. value .. ">" .. data[value]  .. "</dc:" .. value .. ">" .. "\n"
        else
            temp = content .. "\t" .. "<dc:".. value .. "></dc:" .. value .. ">" .. "\n"
        end
        content = temp
    end

    return content .. "\b" .. "</metadata>"
end

-- Function definitions
function getResources()
    local table1 = {}

    table1["data"] = readAllRes({})

    if #table1["data"] > 0 then
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
    local table1 = {}
    local id = string.match(uri, "%d+")

    table1["data"] = readRes(id)

    if (table1["data"] == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        print("no data was found")
        return
    else
        table1["status"] = "successful"
    end

    local newFileName, errMsg = generateFileName(table1["data"])

    if (errMsg ~= nil) then
        table1["data"]["generated_filename"] = table1["data"]["title"]
    else
        table1["data"]["generated_filename"] = newFileName
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

function getResourceContent()
    local id = string.match(uri, "%d+")
    local data = readRes(id)

    -- Data does not exist in the database
    if (data == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        print("no resource found in database")
        return
    end

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

function getPreview()
    local table1 = {}
    local id = string.match(uri, "%d+")
    local data = readRes(id)

    -- Data does not exist in the database
    if (data == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        print("no resource found in database")
        return
    end

    local serverFilename = data["filename"]
    local mimetype = data["mimetype"]

    if (serverFilename == nil) or (mimetype == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(500)
        print("no file infos in data base found")
        return
    end

    if (mimetype ~= "image/jpeg") and (mimetype ~= "image/tiff") and (mimetype ~= "image/jp2") and (mimetype ~= "image/png") then
        print("it is not an image")
        -- output of something else
        return
    end

    local sipiImageSucces, img = SipiImage.new("files/" .. serverFilename)

    if (not sipiImageSucces) then
        print("fail")
        return
    end

    local dimsBeforeSuccess, dimsBefore = img.dims(img)

    if (not dimsBeforeSuccess) then
        print("fail")
        return
    end

    if (dimsBefore.ny < preview.height) then
        table1["resolution"] = {height = dimsBefore.ny, width = dimsBefore.nx}
    else
        img.scale(img, "," .. preview.height)

        local dimsAfterSuccess, dimsAfter = img.dims(img)

        if (not dimsAfterSuccess) then
            print("fail")
            return
        end

        table1["resolution"] = {height = dimsAfter.ny, width = dimsAfter.nx}
    end

    table1["mimetype"] = mimetype

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

function getPreviewContent()
    local id = string.match(uri, "%d+")
    local data = readRes(id)

    -- Data does not exist in the database
    if (data == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        print("no resource found in database")
        return
    end

    local serverFilename = data["filename"]
    local mimetype = data["mimetype"]

    if (serverFilename == nil) or (mimetype == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(500)
        print("no file infos in data base found")
        return
    end

    if (mimetype ~= "image/jpeg") and (mimetype ~= "image/tiff") and (mimetype ~= "image/jp2") and (mimetype ~= "image/png") then
        print("it is not an image")

        -- send the not image
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
        server.sendStatus(200)
        server.print(fileContent)
        return
    end

    local succes, img = SipiImage.new("files/" .. serverFilename)

    if (not succes) then
        print("image not found and could not be created")
        server.sendStatus(500)
        return
    end

    img.scale(img, "," .. preview.height)

    local dimsSuccess, dims = img.dims(img)

    if (not dimsSuccess) then
        print("image could not be scaled")
        server.sendStatus(500)
        return
    end

    server.sendHeader('Content-type', 'image/jpeg')
    local writeSuccess, errorMsg = img.write(img, "HTTP.jpg")

end

function getThumbnailSize()
    local table1 = {}

    local size
    local startSize, endSize = string.find(uri, "thumbnail/")
    if (startSize ~= nil) and (endSize ~= nil) then
        size = string.sub(uri, endSize+1, #uri)
    end

    -- Checks if thumbnail size is valid
    if (thumbnail[size] == nil) then
        print("bad thumbnail size")
        server.sendStatus(400)
        return
    end

    local id = string.match(uri, "%d+")
    local data = readRes(id)

    -- Data does not exist in the database
    if (data == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        print("no resource found in database")
        return
    end

    local serverFilename = data["filename"]

    if (serverFilename == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(500)
        print("no file infos in data base found")
        return
    end

    local width
    if (thumbnailSquare) then
        width = thumbnail[size].height
    else
        width = thumbnail[size].height * 0.75
    end

    table1["resolution"] = {height = thumbnail[size].height, width }

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

function getThumbnailSizeContent()
    local size
    local startSize, endSize = string.find(uri, "thumbnail/")
    local startContent, endContent = string.find(uri, "/content")
    if (startSize ~= nil) and (endSize ~= nil) and (startContent ~= nil) and (endContent ~= nil) then
        size = string.sub(uri, endSize+1, startContent-1)
    end

    -- Checks if thumbnail size is valid
    if (thumbnail[size] == nil) then
        print("bad thumbnail size")
        server.sendStatus(400)
        return
    end

    local id = string.match(uri, "%d+")
    local data = readRes(id)

    -- Data does not exist in the database
    if (data == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        print("no resource found in database")
        return
    end

    local serverFilename = data["filename"]
    local mimetype = data["mimetype"]

    if (serverFilename == nil) or (mimetype == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(500)
        print("no file infos in data base found")
        return
    end

    local typePath
    if (mimetype == "application/pdf") then
        typePath = "assets/pdf.png"
    elseif (mimetype ~= "image/jpeg") and (mimetype ~= "image/tiff") and (mimetype ~= "image/jp2") and (mimetype ~= "image/png") then
        typePath = "assets/unknown.png"
    else
        typePath = "files/" .. serverFilename
    end

    local succes, img = SipiImage.new(typePath)

    if (not succes) then
        print("fail")
        return
    end

    local dimsSuccess, dims = img.dims(img)

    if (not dimsSuccess) then
        print("fail")
        return
    end

    local width
    if (thumbnailSquare) then
        width = thumbnail[size].height
    else
        width = thumbnail[size].height * 0.75
    end

    local imageRatio = dims.nx / dims.ny
    local thumbnailRatio = width / thumbnail[size].height

    if (imageRatio < thumbnailRatio) then
        print("höher als Breite")
        img.scale(img, thumbnail[size].width .. ",")
        local success, dims = img.dims(img)
        if success then
            local startY = (dims.ny - thumbnail[size].height) / 2
            img.crop(img, "0," .. startY .. "," .. width .. "," .. thumbnail[size].height)
        end
    elseif (imageRatio > thumbnailRatio) then
        print("breiter als Höhe")
        img.scale(img, "," .. thumbnail[size].height)
        local success, dims = img.dims(img)
        if success then
            local startX = (dims.nx - width) / 2
            img.crop(img, startX .. ",0," .. width .. "," .. thumbnail[size].height)
        end
    else
        img.scale(img, width .. "," .. thumbnail[size].height)
    end

    server.sendHeader('Content-type', 'image/jpeg')
    local writeSuccess, errorMsg = img.write(img, "HTTP.jpg")
end

function getMetaDataXML()
    local id = string.match(uri, "%d+")
    local data = readRes(id)

    -- Data does not exist in the database
    if (data == nil) then
        server.sendHeader('Content-type', 'application/json')
        server.sendStatus(404)
        print("no resource found in database")
        return
    end

    local newFileName, errMsg = generateFileName(data)

    if (errMsg ~= nil) then
        newFileName = "metadata.xml"
    else
        local startVal, endVal = string.find(newFileName, "%.")
        if (startVal ~= nil) and (endVal ~= nil) then
            newFileName = string.sub(newFileName, 0, endVal) .. "xml"
        end
    end

    local fileContent = getDublinCoreXML(data)

    server.setBuffer()
    server.sendHeader('Access-Control-Expose-Headers','Content-Disposition');
    server.sendHeader('Content-type', 'text/xml')
    server.sendHeader('Content-Disposition', "attachment; filename=" .. newFileName)
    server.sendStatus(200)
    server.print(fileContent)
    return
end

-- Checking of the url and appling the appropriate function
baseURL = "^/api"
uri = server.uri

routes = {}
routes[baseURL .. "/resources$"] = getResources
routes[baseURL .. "/resources/%d+$"] = getResource
routes[baseURL .. "/resources/%d+/content$"] = getResourceContent
routes[baseURL .. "/resources/%d+/preview$"] = getPreview
routes[baseURL .. "/resources/%d+/preview/content$"] = getPreviewContent
routes[baseURL .. "/resources/%d+/thumbnail/%a+$"] = getThumbnailSize
routes[baseURL .. "/resources/%d+/thumbnail/%a+/content$"] = getThumbnailSizeContent
routes[baseURL .. "/resources/%d+/metadata/xml"] = getMetaDataXML

for route, func in pairs(routes) do
    if (string.match(uri, route) ~= nil) then
        func()
        return
    end
end

-- Fails if no url matches
server.sendStatus(404)
