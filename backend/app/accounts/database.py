from supabase import create_client, Client
from fastapi import FastAPI
import os



SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPBASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL,SUPBASE_KEY)