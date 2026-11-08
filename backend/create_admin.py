import os


if os.getenv("SHILPO_DEMO_MODE", "false").lower() == "true":
    raise SystemExit("Set SHILPO_DEMO_MODE=false before creating a production admin.")

from getpass import getpass

from sqlalchemy import func

from backend.main import SessionLocal, User, hash_password


def main() -> None:
    name = input("Admin name: ").strip()
    email = input("Admin email: ").strip().lower()
    password = getpass("Admin password (12+ characters): ")
    confirmation = getpass("Confirm password: ")

    if len(name) < 2 or "@" not in email:
        raise SystemExit("Enter a valid name and email address.")
    if len(password) < 12:
        raise SystemExit("Use a password with at least 12 characters.")
    if password != confirmation:
        raise SystemExit("The passwords do not match.")

    with SessionLocal() as db:
        exists = db.query(User).filter(func.lower(User.email) == email).first()
        if exists:
            raise SystemExit("An account with this email already exists.")
        admin = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            role="admin",
            verified=True,
        )
        db.add(admin)
        db.commit()

    print(f"Created admin account for {email}.")


if __name__ == "__main__":
    main()