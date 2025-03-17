import glob
import os
import subprocess
import time
from logging import debug

import requests


def concatenate_videos_by_mask(mask, output_file):
    video_files = glob.glob(mask)
    with open(f"{output_file}.txt", 'w') as f:
        for video in video_files:
            f.write(f"file {video}\n")
    if not video_files:
        debug("Не найдено видеофайлов по заданной маске.")
        return

    process = subprocess.Popen(
        ['ffmpeg', '-f', 'concat', '-safe', '0', '-i', f"{output_file}.txt",
         '-c',
         'copy', output_file],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    stdout, stderr = process.communicate()
    while True:
        if process.returncode == 0:
            debug(f"Process completed successfully:\n{stdout.decode()}")
            for video in video_files:
                os.remove(video)
                debug(f"Удален файл: {video}")
            os.remove(f"{output_file}.txt")
            return 1
        else:
            time.sleep(2)


def download_video(url, save_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        debug(f"Скачано: {save_path}")
    else:
        debug(f"Ошибка загрузки {url}: {response.status_code}")


def download_videos(base_url, mask, start_index):
    index = start_index
    name = base_url.split('.ru/')[1]
    while True:
        video_url = f"{base_url}/{mask.format(index)}"
        save_path = f"video_{name}_{index}.mp4"

        if os.path.exists(save_path):
            debug(f"Файл уже существует: {save_path}")
            index += 1
            continue

        download_video(video_url, save_path)

        if requests.get(video_url).status_code == 404:
            debug("Загрузка завершена. 404 ошибка получена.")
            mask = f"video_{name}_*.mp4"
            output_file = f"final_{name}_video.mp4"
            concatenate_videos_by_mask(mask, output_file)
            return 1

        index += 1
