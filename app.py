from flask import Flask, request, jsonify
from flask_cors import CORS

from logging import debug, basicConfig, DEBUG
from core import download_videos


basicConfig(level=DEBUG,)

app = Flask(__name__)
CORS(app)


@app.route('/download-video', methods=['POST'])
def download_video():
    data = request.json
    debug(data)
    video_url = data.get('url').replace('/preview.webp', '')
    debug(video_url)

    mask = "{}.ts"
    start_index = 1

    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    if download_videos(video_url, mask, start_index):
        return jsonify({"message": "Video downloaded successfully!"}), 200

    return jsonify({"error": "Video not downloaded"}), 500


if __name__ == '__main__':
    app.run(port=5000)
