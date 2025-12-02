from flask import Flask, jsonify, request
app = Flask(__name__)

rooms = {"public": [], "private": []}

@app.get("/api/rooms")
def get_rooms():
    return jsonify(rooms)

@app.post("/api/rooms")
def create_room():
    data=request.json
    rtype=data.get("type","public")
    name=data.get("name","unnamed")
    rooms.setdefault(rtype,[]).append({"name":name})
    return {"status":"ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
