from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import sys

app = Flask(__name__)
CORS(app)

try:
    client = MongoClient(
        "mongodb+srv://rtspuser:rtspuser@hello-world.5zf0oai.mongodb.net/?appName=hello-world",
        serverSelectionTimeoutMS=5000
    )
    client.admin.command("ping")
    print(" MongoDB connected successfully")
except Exception as e:
    print("MongoDB connection failed")
    print(e)
    sys.exit(1)

db = client["overlaydb"]
collection = db["overlays"]

@app.route("/stream/<path:filename>")
def stream_files(filename):
    return send_from_directory("stream", filename)

@app.route("/overlays", methods=["GET"])
def get_overlays():
    overlays = []
    for o in collection.find():
        o["_id"] = str(o["_id"])
        overlays.append(o)
    return jsonify(overlays)

@app.route("/overlays", methods=["POST"])
def create_overlay():
    data = request.json
    collection.insert_one(data)
    return jsonify({"status": "created"}), 201

@app.route("/overlays/<id>", methods=["PUT"])
def update_overlay(id):
    data = request.json
    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    return jsonify({"status": "updated"})

@app.route("/overlays/<id>", methods=["DELETE"])
def delete_overlay(id):
    collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"status": "deleted"})

if __name__ == "__main__":
    app.run(debug=True)
