import os
import gdown
from dotenv import load_dotenv
load_dotenv()


files = {
    "glove.model": os.getenv("DRIVE_1"),
    "glove.model.vectors.npy": os.getenv("DRIVE_2")
}

print(files)

# for filename, file_id in files.items():
#     if not os.path.exists(filename):
#         print(f"Downloading {filename}...")
#         url = f"https://drive.google.com/uc?id={file_id}"
#         gdown.download(url, filename, quiet=False)
