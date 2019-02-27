print("---- POST login script ----")

-- Required external script files
require "./crud/user"

-- Token expire time in seconds
local expireTime = 20

-- Checks if parameter name and passwort are nil
if (server.post["name"] == nil) or (server.post["password"] == nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(400)
end

local userData = readUser(server.post["name"])

-- Checks if user name exists
if (userData == nil) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(401)
    return
end

-- Checks if password is correct
if (userData["pwd"] ~= server.post["password"]) then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(401)
    return
end

-- Generate token
local claims = { exp = os.time() + expireTime; user = server.post["name"] }
local successToken, token = server.generate_jwt(claims)

-- Checks if token was generated
if not successToken then
    server.sendHeader('Content-type', 'application/json')
    server.sendStatus(500)
    return
end

-- Sends token back
local table1 = {}
table1["token"] = token

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



--local success, auth = server.requireAuth()
--
---- Checks if auth function worked
--if not success then
--    server.sendHeader('Content-type', 'application/json')
--    server.sendStatus(500)
--    return
--end
--
---- Checks if token is attached
--if (auth["status"] == "NOAUTH") then
--    print("no authentification", auth["status"])
--    server.sendStatus(401)
--    return
--end
--
---- Checks if authentification is of type BEARER
--if (auth["status"] ~= "BEARER") then
--    print("wrong authentification type", auth["status"])
--    server.sendStatus(401)
--    return
--end
--
--local successDecode, claim1 = server.decode_jwt(auth["token"])
--
---- Checks if decode of token failed
--if not successDecode then
--    server.sendHeader('Content-type', 'application/json')
--    server.sendStatus(500)
--    return
--end
--
---- Checks if token is expired
--local now = os.time()
--if (claim1["exp"] >= now) then
--    print("not expired")
--else
--    print("expired")
--end
