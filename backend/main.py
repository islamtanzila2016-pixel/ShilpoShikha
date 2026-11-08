import hashlib
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Literal
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, and_, create_engine, func, or_, text
from sqlalchemy.orm import DeclarativeBase, Session, mapped_column, sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./shilposhikha.db")
DEMO_MODE = os.getenv("SHILPO_DEMO_MODE", "false").lower() == "true"
AI_API_URL = os.getenv("AI_API_URL", "").strip()
AI_API_KEY = os.getenv("AI_API_KEY", "").strip()
AI_MODEL = os.getenv("AI_MODEL", "").strip()
engine_options = {"connect_args": {"check_same_thread": False}} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, pool_pre_ping=True, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(120), nullable=False)
    email = mapped_column(String(190), unique=True, index=True, nullable=False)
    password_hash = mapped_column(String(256), nullable=False)
    role = mapped_column(String(24), nullable=False)
    phone = mapped_column(String(40), default="")
    location = mapped_column(String(120), default="")
    verified = mapped_column(Boolean, default=False, nullable=False)


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(ForeignKey("users.id"), nullable=False)
    token_hash = mapped_column(String(64), unique=True, index=True, nullable=False)
    expires_at = mapped_column(DateTime, nullable=False)


class Verification(Base):
    __tablename__ = "verifications"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(ForeignKey("users.id"), nullable=False)
    document_name = mapped_column(String(180), nullable=False)
    status = mapped_column(String(24), default="Pending", nullable=False)
    submitted_at = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class Order(Base):
    __tablename__ = "orders"

    id = mapped_column(Integer, primary_key=True)
    buyer_id = mapped_column(ForeignKey("users.id"), nullable=False)
    artisan_id = mapped_column(ForeignKey("users.id"), nullable=True)
    product = mapped_column(String(180), nullable=False)
    quantity = mapped_column(Integer, nullable=False)
    unit_price = mapped_column(Integer, nullable=False)
    subtotal = mapped_column(Integer, nullable=False)
    delivery_charge = mapped_column(Integer, nullable=False)
    advance_amount = mapped_column(Integer, nullable=False)
    balance_amount = mapped_column(Integer, nullable=False)
    zone = mapped_column(String(60), nullable=False)
    status = mapped_column(String(40), default="Awaiting artisan", nullable=False)
    payment_status = mapped_column(String(40), default="Advance pending", nullable=False)
    delivery_status = mapped_column(String(40), default="Not dispatched", nullable=False)
    created_at = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class Payment(Base):
    __tablename__ = "payments"

    id = mapped_column(Integer, primary_key=True)
    order_id = mapped_column(ForeignKey("orders.id"), nullable=False)
    amount = mapped_column(Integer, nullable=False)
    method = mapped_column(String(40), nullable=False)
    status = mapped_column(String(24), nullable=False)
    reference = mapped_column(String(80), unique=True, nullable=False)
    created_at = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class Shipment(Base):
    __tablename__ = "shipments"

    id = mapped_column(Integer, primary_key=True)
    order_id = mapped_column(ForeignKey("orders.id"), unique=True, nullable=False)
    carrier = mapped_column(String(80), default="ShilpoShikha Logistics", nullable=False)
    tracking_code = mapped_column(String(80), unique=True, nullable=False)
    status = mapped_column(String(40), default="Not dispatched", nullable=False)
    updated_at = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=5, max_length=190)
    password: str = Field(min_length=8, max_length=128)
    role: Literal["learner", "artisan", "buyer"]
    phone: str = ""
    location: str = ""


class LoginRequest(BaseModel):
    email: str
    password: str


class VerificationRequest(BaseModel):
    document_name: str = Field(min_length=2, max_length=180)


class VerificationDecision(BaseModel):
    status: Literal["Approved", "Rejected"]


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    topic: str = "Handcraft basics"
    locale: Literal["bn", "en"] = "bn"


class FeedbackRequest(BaseModel):
    project: str = Field(min_length=8, max_length=3000)


class OrderRequest(BaseModel):
    product: str = Field(min_length=2, max_length=180)
    quantity: int = Field(ge=20, le=100000)
    unit_price: int = Field(gt=0, le=10000000)
    zone: Literal["Dhaka", "Chattogram", "Other district"] = "Dhaka"
    artisan_id: int | None = None


class ShipmentUpdate(BaseModel):
    status: Literal["Processing", "Picked up", "In transit", "Delivered"]
    carrier: str = "ShilpoShikha Logistics"


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 240000)
    return f"{salt}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, expected = stored_hash.split("$", 1)
    except ValueError:
        return False
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 240000).hex()
    return secrets.compare_digest(actual, expected)


def issue_session(db: Session, user: User) -> str:
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(days=30)
    db.add(UserSession(user_id=user.id, token_hash=token_hash, expires_at=expires_at))
    db.commit()
    return token


def resolve_user(db: Session, authorization: str | None, x_user_id: int | None, demo_mode: bool = DEMO_MODE) -> User:
    if authorization:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() != "bearer" or not token:
            raise HTTPException(status_code=401, detail="A valid bearer token is required.")
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        session = db.query(UserSession).filter_by(token_hash=token_hash).first()
        if not session:
            raise HTTPException(status_code=401, detail="Session is invalid or expired.")
        expires_at = session.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at <= datetime.now(timezone.utc):
            db.delete(session)
            db.commit()
            raise HTTPException(status_code=401, detail="Session is invalid or expired.")
        user = db.get(User, session.user_id)
        if user:
            return user
        raise HTTPException(status_code=401, detail="Session user no longer exists.")
    if demo_mode and x_user_id is not None:
        user = db.get(User, x_user_id)
        if user:
            return user
    raise HTTPException(status_code=401, detail="Sign in to continue.")


def calculate_order(quantity: int, unit_price: int, zone: str) -> dict[str, int]:
    if quantity < 1 or unit_price < 1:
        raise ValueError("Quantity and unit price must be positive.")
    base_delivery = {"Dhaka": 120, "Chattogram": 220, "Other district": 300}
    if zone not in base_delivery:
        raise ValueError("Choose a supported delivery zone.")
    subtotal = quantity * unit_price
    delivery_charge = base_delivery[zone] + quantity * 15
    advance_amount = (subtotal + 1) // 2
    return {
        "subtotal": subtotal,
        "delivery_charge": delivery_charge,
        "advance_amount": advance_amount,
        "balance_amount": subtotal - advance_amount,
        "total_amount": subtotal + delivery_charge,
    }


def ai_completion(messages: list[dict[str, str]], json_mode: bool = False) -> str:
    if not AI_API_URL or not AI_API_KEY or not AI_MODEL:
        raise HTTPException(status_code=503, detail="AI provider is not configured.")
    payload = {"model": AI_MODEL, "messages": messages}
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
    request = Request(
        AI_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {AI_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=30) as response:
            result = json.loads(response.read())
        content = result["choices"][0]["message"]["content"]
    except HTTPError as error:
        raise HTTPException(status_code=502, detail="AI provider request failed.") from error
    except (URLError, TimeoutError) as error:
        raise HTTPException(status_code=502, detail="AI provider is unreachable.") from error
    except (KeyError, IndexError, TypeError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=502, detail="AI provider returned an invalid response.") from error
    if not isinstance(content, str) or not content.strip():
        raise HTTPException(status_code=502, detail="AI provider returned an empty response.")
    return content.strip()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def user_payload(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "phone": user.phone,
        "location": user.location,
        "verified": user.verified,
    }


def order_payload(order: Order, db: Session) -> dict:
    buyer = db.get(User, order.buyer_id)
    artisan = db.get(User, order.artisan_id) if order.artisan_id else None
    shipment = db.query(Shipment).filter_by(order_id=order.id).first()
    return {
        "id": order.id,
        "buyer_id": order.buyer_id,
        "buyer": buyer.name if buyer else "Unknown buyer",
        "artisan_id": order.artisan_id,
        "artisan": artisan.name if artisan else "Unassigned",
        "product": order.product,
        "quantity": order.quantity,
        "unit_price": order.unit_price,
        "subtotal": order.subtotal,
        "delivery_charge": order.delivery_charge,
        "advance_amount": order.advance_amount,
        "balance_amount": order.balance_amount,
        "total_amount": order.subtotal + order.delivery_charge,
        "zone": order.zone,
        "status": order.status,
        "payment_status": order.payment_status,
        "delivery_status": shipment.status if shipment else order.delivery_status,
        "tracking_code": shipment.tracking_code if shipment else None,
        "carrier": shipment.carrier if shipment else None,
        "created_at": order.created_at.isoformat() if order.created_at else None,
    }


Base.metadata.create_all(bind=engine)


app = FastAPI(title="ShilpoShikha API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def current_user(
    authorization: str | None = Header(default=None),
    x_user_id: int | None = Header(default=1 if DEMO_MODE else None, alias="X-User-Id"),
    db: Session = Depends(get_db),
) -> User:
    return resolve_user(db, authorization, x_user_id)


def admin_user(user: User = Depends(current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin approval is required.")
    return user


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "mode": "demo" if DEMO_MODE else "production", "ai_available": bool(AI_API_URL and AI_API_KEY and AI_MODEL)}


@app.post("/api/auth/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(func.lower(User.email) == payload.email.lower()).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    user = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        role=payload.role,
        phone=payload.phone,
        location=payload.location,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = issue_session(db, user)
    return {"user": user_payload(user), "access_token": token, "token_type": "bearer", "demo": DEMO_MODE}


@app.post("/api/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(func.lower(User.email) == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")
    token = issue_session(db, user)
    return {"user": user_payload(user), "access_token": token, "token_type": "bearer", "demo": DEMO_MODE}


@app.post("/api/auth/logout")
def logout(authorization: str | None = Header(default=None), db: Session = Depends(get_db), _user: User = Depends(current_user)):
    token = authorization.partition(" ")[2] if authorization else ""
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    session = db.query(UserSession).filter_by(token_hash=token_hash).first()
    if session:
        db.delete(session)
        db.commit()
    return {"status": "ok"}


@app.get("/api/users")
def list_users(db: Session = Depends(get_db), _admin: User = Depends(admin_user)):
    return [user_payload(user) for user in db.query(User).order_by(User.id).all()]


@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db), _user: User = Depends(current_user)):
    payments_total = db.query(func.sum(Payment.amount)).filter(Payment.status == "Confirmed").scalar() or 0
    return {
        "users": db.query(User).count(),
        "artisans": db.query(User).filter(User.role == "artisan").count(),
        "active_orders": db.query(Order).filter(Order.status.notin_(["Delivered", "Cancelled"])).count(),
        "pending_verifications": db.query(Verification).filter(Verification.status == "Pending").count(),
        "advance_collected": int(payments_total),
    }


@app.post("/api/users/{user_id}/verification")
def submit_verification(user_id: int, payload: VerificationRequest, db: Session = Depends(get_db), actor: User = Depends(current_user)):
    if actor.id != user_id and actor.role != "admin":
        raise HTTPException(status_code=403, detail="You can only submit your own verification.")
    if not db.get(User, user_id):
        raise HTTPException(status_code=404, detail="User not found.")
    verification = Verification(user_id=user_id, document_name=payload.document_name)
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return {"id": verification.id, "user_id": user_id, "document_name": verification.document_name, "status": verification.status}


@app.get("/api/verifications")
def list_verifications(db: Session = Depends(get_db), _admin: User = Depends(admin_user)):
    rows = db.query(Verification).order_by(Verification.submitted_at.desc()).all()
    return [
        {
            "id": row.id,
            "user_id": row.user_id,
            "name": db.get(User, row.user_id).name if db.get(User, row.user_id) else "Unknown",
            "document_name": row.document_name,
            "status": row.status,
            "submitted_at": row.submitted_at.isoformat() if row.submitted_at else None,
        }
        for row in rows
    ]


@app.patch("/api/verifications/{verification_id}")
def decide_verification(verification_id: int, payload: VerificationDecision, db: Session = Depends(get_db), _admin: User = Depends(admin_user)):
    row = db.get(Verification, verification_id)
    if not row:
        raise HTTPException(status_code=404, detail="Verification not found.")
    row.status = payload.status
    user = db.get(User, row.user_id)
    if user:
        user.verified = payload.status == "Approved"
    db.commit()
    return {"id": row.id, "status": row.status}


@app.post("/api/ai/chat")
def ai_chat(payload: ChatRequest, _user: User = Depends(current_user)):
    language = "Bangla" if payload.locale == "bn" else "English"
    answer = ai_completion([
        {"role": "system", "content": f"You are a practical craft-learning teacher. Reply in {language}. Give concise, actionable guidance and do not claim to verify identity, safety, or prices."},
        {"role": "user", "content": f"Topic: {payload.topic}\nQuestion: {payload.message}"},
    ])
    return {"answer": answer, "simulated": False, "provider": AI_MODEL}


@app.post("/api/ai/feedback")
def project_feedback(payload: FeedbackRequest, _user: User = Depends(current_user)):
    content = ai_completion([
        {"role": "system", "content": "Review a craft project in Bangla. Return only a JSON object with integer score from 0 to 100 and arrays strengths and suggestions. Be constructive and base feedback only on the supplied description; do not imply that you saw a photograph."},
        {"role": "user", "content": payload.project},
    ], json_mode=True)
    try:
        feedback = json.loads(content)
        score = max(0, min(100, int(feedback["score"])))
        strengths = feedback["strengths"]
        suggestions = feedback["suggestions"]
        if not isinstance(strengths, list) or not isinstance(suggestions, list):
            raise TypeError("Feedback fields must be arrays.")
    except (KeyError, TypeError, ValueError, json.JSONDecodeError) as error:
        raise HTTPException(status_code=502, detail="AI provider returned invalid project feedback.") from error
    return {
        "score": score,
        "strengths": [str(item) for item in strengths[:5]],
        "suggestions": [str(item) for item in suggestions[:5]],
        "simulated": False,
        "provider": AI_MODEL,
    }


@app.get("/api/orders")
def list_orders(db: Session = Depends(get_db), actor: User = Depends(current_user)):
    query = db.query(Order)
    if actor.role == "buyer":
        query = query.filter(Order.buyer_id == actor.id)
    elif actor.role == "artisan":
        query = query.filter(
            or_(
                Order.artisan_id == actor.id,
                and_(Order.artisan_id.is_(None), Order.status == "Awaiting artisan"),
            )
        )
    elif actor.role != "admin":
        return []
    return [order_payload(order, db) for order in query.order_by(Order.created_at.desc()).all()]


@app.post("/api/orders")
def create_order(payload: OrderRequest, db: Session = Depends(get_db), actor: User = Depends(current_user)):
    if actor.role not in ("buyer", "admin"):
        raise HTTPException(status_code=403, detail="Only buyers can place orders.")
    if payload.artisan_id:
        artisan = db.get(User, payload.artisan_id)
        if not artisan or artisan.role != "artisan":
            raise HTTPException(status_code=404, detail="Artisan not found.")
    amounts = calculate_order(payload.quantity, payload.unit_price, payload.zone)
    order = Order(
        buyer_id=actor.id,
        artisan_id=payload.artisan_id,
        product=payload.product,
        quantity=payload.quantity,
        unit_price=payload.unit_price,
        zone=payload.zone,
        **{key: amounts[key] for key in ("subtotal", "delivery_charge", "advance_amount", "balance_amount")},
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order_payload(order, db)


@app.patch("/api/orders/{order_id}/accept")
def accept_order(order_id: int, db: Session = Depends(get_db), actor: User = Depends(current_user)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if actor.role not in ("artisan", "admin"):
        raise HTTPException(status_code=403, detail="An artisan must accept this order.")
    if actor.role == "artisan" and order.artisan_id not in (None, actor.id):
        raise HTTPException(status_code=403, detail="This order is assigned to another artisan.")
    order.artisan_id = actor.id if actor.role == "artisan" else order.artisan_id
    order.status = "Accepted"
    db.commit()
    return order_payload(order, db)


@app.post("/api/orders/{order_id}/payments")
def simulate_payment(order_id: int, db: Session = Depends(get_db), actor: User = Depends(current_user)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if actor.role not in ("buyer", "admin") or (actor.role == "buyer" and order.buyer_id != actor.id):
        raise HTTPException(status_code=403, detail="Only the buyer can confirm this advance.")
    if order.payment_status == "Advance paid":
        raise HTTPException(status_code=409, detail="The advance is already confirmed.")
    payment = Payment(
        order_id=order.id,
        amount=order.advance_amount,
        method="Simulated bKash",
        status="Confirmed",
        reference=f"SS-{secrets.token_hex(4).upper()}",
    )
    order.payment_status = "Advance paid"
    db.add(payment)
    db.commit()
    return {"payment_id": payment.id, "amount": payment.amount, "status": payment.status, "reference": payment.reference, "simulated": True}


@app.patch("/api/orders/{order_id}/shipment")
def update_shipment(order_id: int, payload: ShipmentUpdate, db: Session = Depends(get_db), actor: User = Depends(current_user)):
    if actor.role not in ("admin", "artisan"):
        raise HTTPException(status_code=403, detail="Only an admin or artisan can update delivery status.")
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if actor.role == "artisan" and order.artisan_id != actor.id:
        raise HTTPException(status_code=403, detail="This order is not assigned to you.")
    shipment = db.query(Shipment).filter_by(order_id=order.id).first()
    if not shipment:
        shipment = Shipment(order_id=order.id, carrier=payload.carrier, tracking_code=f"SS-{secrets.token_hex(4).upper()}")
        db.add(shipment)
    shipment.status = payload.status
    shipment.carrier = payload.carrier
    shipment.updated_at = datetime.now(timezone.utc)
    order.delivery_status = payload.status
    if payload.status == "Delivered":
        order.status = "Delivered"
    db.commit()
    return order_payload(order, db)


@app.get("/api/orders/{order_id}/receipt")
def order_receipt(order_id: int, db: Session = Depends(get_db), actor: User = Depends(current_user)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    if actor.role == "artisan" and order.artisan_id != actor.id:
        raise HTTPException(status_code=403, detail="This order is not assigned to you.")
    if actor.role not in ("admin", "artisan") and order.buyer_id != actor.id:
        raise HTTPException(status_code=403, detail="You cannot view this receipt.")
    return {
        "order": order_payload(order, db),
        "payments": [
            {"amount": payment.amount, "method": payment.method, "status": payment.status, "reference": payment.reference}
            for payment in db.query(Payment).filter_by(order_id=order.id).all()
        ],
        "issued_at": datetime.now(timezone.utc).isoformat(),
    }