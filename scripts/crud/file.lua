
filedir = require ("./config/s3r-config").files.dir

-------------------------------------------------------------------------------
-- @section All CRUD Operations on a file

-------------------------------------------------------------------------------
-- Creates a file on the file system
-- @param   'parameters' (table):  table with name of parameter and value
-- @return  'parameters' (table):  table with added metadata about the file
function createFile(parameters)
    for fileIndex, fileParam in pairs(server.uploads) do

        local startPos, endPos = string.find(fileParam["origname"], "%.")
        local fileEnding = string.sub(fileParam["origname"], endPos+1, string.len(fileParam["origname"]))

        local fileDir = 'files/'
        local success, exists = server.fs.exists(fileDir)

        if not success then
            -- Was ist das für ein Fall?
        end

        if not exists then
            local success, errmsg = server.fs.mkdir(fileDir, 511)
            if not success then
                --            server.print("<br> Directory couldn't be created <br>")
            end
        else
            --        server.print("directory exists <br>")
        end

        local success, uuid62 = server.uuid62()
        if not success then
        end

        -- print(uuid62 .. '_' .. string.gsub(parameters['title'], " ", "-"))

        parameters["filename"] = uuid62 .. '.' .. fileEnding
        parameters["type"] = fileParam["mimetype"]
        parameters["mimetype"] = fileParam["mimetype"]
        parameters["filesize"] = fileParam["filesize"]

        local tmppath =  fileDir .. parameters["filename"]

        local success, errmsg = server.copyTmpfile(fileIndex, tmppath)
        if not success then
        else
        end

        return parameters
    end
end

-------------------------------------------------------------------------------
-- Reads the content of the file
-- @param   'filename' (string):  name of the file with the file ending
-- @return  'content': content of the file
-- @return  'errMsg': Error if file does not exists
function readFile(filename)
    local content, errMsg
    local file = io.open(filedir .. filename)

    if (file) then
        io.input(file)
        content = io.read("*a")
        io.close(file)
    else
        errMsg = 500
    end

    return content, errMsg
end

-------------------------------------------------------------------------------
-- Updates the file by replacing the old file with the new one from server.uploads
-- @param   'parameters' (table):  table with name of parameter and value
-- @param   'filename' (string):  name of the file with the file ending
-- @return  'parameters' (table):  table with updated data and metadata about the file
function updateFile(parameters, filename)
    parameters = createFile(parameters)
    deleteFile(filename)
    return parameters
end

-------------------------------------------------------------------------------
-- Deletes the file on the file system
-- @param   'filename' (string):  name of the file with the file ending
function deleteFile(fileName)
    if (os.remove(filedir .. fileName)) then
        print("file deleted")
    else
        print("file could not be deleted")
    end
end

-------------------------------------------------------------------------------
--@section Other Function

-------------------------------------------------------------------------------
-- Generates the file name
-- @param   'data' (table): data of a resource
-- @return  (string): generated file name
-- @return  (errMsg): error if file name could not be generated
function generateFileName(data)
    local year, title, signature, ending, dump, errMsg

    if (data["date_start"] == data["date_end"]) then
        year = data["date_start"]
    else
        year = data["date_start"] .. "-" .. data["date_end"]
    end

    -- Replace space with "-"
    signature, dump = string.gsub(data["signature"], " ", "-")
    title, dump = string.gsub(data["title"], " ", "-")
    -- Eliminate "."
    title, dump = string.gsub(title, "%.", "")
    -- Replace "ä" with "ae"
    title, dump = string.gsub(title, "ä", "ae")
    -- Replace "ö" with "oe"
    title, dump = string.gsub(title, "ö", "oe")
    -- Replace "ü" with "üe"
    title, dump = string.gsub(title, "ü", "ue")
    title = title:sub(1,1):upper()..title:sub(2)

    local startVal, endVal = string.find(data["filename"], "%.")
    if (startVal ~= nil) and (endVal ~= nil) then
        ending = string.sub(data["filename"], endVal+1, #data["filename"])
    else
        errMsg = 500
    end

    return year .. "_" .. title ..  "_" .. signature .. "." .. ending, errMsg
end
