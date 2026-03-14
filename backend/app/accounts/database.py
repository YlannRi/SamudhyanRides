import os

from supabase import Client, create_client


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


def create_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)


supabase: Client = create_supabase_client()
