import os
import json
from datetime import datetime, timedelta

import bcrypt
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Study Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://studyhub:studyhub_local@localhost:5432/studyhub",
)
JWT_SECRET = os.environ.get("JWT_SECRET", "local-dev-secret-change-me")


def get_conn():
    return psycopg2.connect(DATABASE_URL)


def get_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class AuthPayload(BaseModel):
    email: str
    password: str


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


@app.post("/api/auth/register")
def register(payload: AuthPayload):
    password_hash = bcrypt.hashpw(
        payload.password.encode(), bcrypt.gensalt()
    ).decode()
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id",
                (payload.email.lower(), password_hash),
            )
            user_id = cur.fetchone()[0]
        conn.commit()
        token = jwt.encode(
            {"user_id": user_id, "email": payload.email.lower(),
             "exp": datetime.utcnow() + timedelta(days=30)},
            JWT_SECRET, algorithm="HS256",
        )
        return {"token": token, "email": payload.email.lower()}
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=409, detail="Email already registered")
    finally:
        conn.close()


@app.post("/api/auth/login")
def login(payload: AuthPayload):
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id, password_hash FROM users WHERE email = %s",
                (payload.email.lower(),),
            )
            user = cur.fetchone()
        if not user or not bcrypt.checkpw(
            payload.password.encode(), user["password_hash"].encode()
        ):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        token = jwt.encode(
            {"user_id": user["id"], "email": payload.email.lower(),
             "exp": datetime.utcnow() + timedelta(days=30)},
            JWT_SECRET, algorithm="HS256",
        )
        return {"token": token, "email": payload.email.lower()}
    finally:
        conn.close()


@app.get("/api/progress/{hub_name}")
def get_progress(hub_name: str, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT progress FROM study_progress WHERE hub_name = %s AND user_id = %s",
                (hub_name, user_id),
            )
            row = cur.fetchone()
            if row:
                return {"progress": row["progress"]}
            return {"progress": {}}
    finally:
        conn.close()


@app.put("/api/progress/{hub_name}")
def save_progress(hub_name: str, payload: ProgressPayload, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO study_progress (hub_name, user_id, progress, updated_at)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (hub_name, user_id)
                DO UPDATE SET progress = EXCLUDED.progress,
                              updated_at = EXCLUDED.updated_at
                """,
                (hub_name, user_id, json.dumps(payload.progress), datetime.utcnow()),
            )
        conn.commit()
        return {"status": "saved", "hub_name": hub_name}
    finally:
        conn.close()
