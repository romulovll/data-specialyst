import os
import json
from datetime import datetime

import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Study Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "PUT", "OPTIONS"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://studyhub:studyhub_local@localhost:5432/studyhub",
)


def get_conn():
    return psycopg2.connect(DATABASE_URL)


class ProgressPayload(BaseModel):
    progress: dict


@app.get("/api/health")
def health():
    try:
        conn = get_conn()
        conn.close()
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.get("/api/progress/{hub_name}")
def get_progress(hub_name: str):
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT progress FROM study_progress WHERE hub_name = %s",
                (hub_name,),
            )
            row = cur.fetchone()
            if row:
                return {"progress": row["progress"]}
            return {"progress": {}}
    finally:
        conn.close()


@app.put("/api/progress/{hub_name}")
def save_progress(hub_name: str, payload: ProgressPayload):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO study_progress (hub_name, progress, updated_at)
                VALUES (%s, %s, %s)
                ON CONFLICT (hub_name)
                DO UPDATE SET progress = EXCLUDED.progress,
                              updated_at = EXCLUDED.updated_at
                """,
                (hub_name, json.dumps(payload.progress), datetime.utcnow()),
            )
        conn.commit()
        return {"status": "saved", "hub_name": hub_name}
    finally:
        conn.close()
