### server/config.py
import os
from dotenv import load_dotenv
load_dotenv()

MODEL_NAME = os.getenv("MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")