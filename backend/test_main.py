import json
import unittest
from io import BytesIO
from unittest.mock import patch

from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import (
    Base,
    ChatRequest,
    FeedbackRequest,
    Order,
    OrderRequest,
    Payment,
    ShipmentUpdate,
    SessionLocal,
    User,
    Verification,
    VerificationDecision,
    AI_API_KEY,
    AI_API_URL,
    AI_MODEL,
    ai_chat,
    calculate_order,
    create_order,
    decide_verification,
    hash_password,
    issue_session,
    list_orders,
    logout,
    order_receipt,
    project_feedback,
    resolve_user,
    simulate_payment,
    update_shipment,
    verify_password,
)


class OrderCalculationTests(unittest.TestCase):
    def test_calculates_half_advance_and_zone_delivery(self):
        result = calculate_order(10, 125, "Dhaka")
        self.assertEqual(result["subtotal"], 1250)
        self.assertEqual(result["advance_amount"], 625)
        self.assertEqual(result["balance_amount"], 625)
        self.assertEqual(result["delivery_charge"], 270)
        self.assertEqual(result["total_amount"], 1520)

    def test_rounds_odd_subtotal_up_to_half_taka(self):
        result = calculate_order(1, 101, "Other district")
        self.assertEqual(result["advance_amount"], 51)
        self.assertEqual(result["balance_amount"], 50)

    def test_rejects_unknown_zone(self):
        with self.assertRaises(ValueError):
            calculate_order(1, 100, "Unknown")


class PasswordTests(unittest.TestCase):
    def test_password_hash_verifies_without_storing_plaintext(self):
        encoded = hash_password("sample-password")
        self.assertNotIn("sample-password", encoded)
        self.assertTrue(verify_password("sample-password", encoded))
        self.assertFalse(verify_password("wrong-password", encoded))


class AIProviderTests(unittest.TestCase):
    def test_chat_requires_a_configured_provider(self):
        with patch.multiple("backend.main", AI_API_URL="", AI_API_KEY="", AI_MODEL=""):
            with self.assertRaises(HTTPException) as error:
                ai_chat(ChatRequest(message="আমার কাজের দাম কীভাবে ঠিক করব?"), None)
        self.assertEqual(error.exception.status_code, 503)

    @patch("backend.main.urlopen")
    def test_chat_sends_bangla_prompt_to_configured_provider(self, mock_urlopen):
        mock_urlopen.return_value = BytesIO(json.dumps({"choices": [{"message": {"content": "কাঁচামাল ও শ্রমের খরচ হিসাব করুন।"}}]}).encode())
        with patch.multiple("backend.main", AI_API_URL="https://ai.example.test/v1/chat/completions", AI_API_KEY="test-key", AI_MODEL="craft-model"):
            result = ai_chat(ChatRequest(message="দাম কীভাবে ঠিক করব?"), None)
        self.assertFalse(result["simulated"])
        self.assertEqual(result["provider"], "craft-model")
        request = mock_urlopen.call_args.args[0]
        self.assertEqual(request.headers["Authorization"], "Bearer test-key")
        self.assertIn("Bangla", json.loads(request.data)["messages"][0]["content"])

    @patch("backend.main.urlopen")
    def test_project_feedback_uses_provider_json(self, mock_urlopen):
        response = {"score": 87, "strengths": ["পরিষ্কার নকশা"], "suggestions": ["আরও মাপ যোগ করুন"]}
        provider_response = {"choices": [{"message": {"content": json.dumps(response, ensure_ascii=False)}}]}
        mock_urlopen.return_value = BytesIO(json.dumps(provider_response, ensure_ascii=False).encode())
        with patch.multiple("backend.main", AI_API_URL="https://ai.example.test/v1/chat/completions", AI_API_KEY="test-key", AI_MODEL="craft-model"):
            result = project_feedback(FeedbackRequest(project="আমি জামদানি ও সুতির কাপড় দিয়ে একটি টেবিল রানার বানিয়েছি।"), None)
        self.assertEqual(result["score"], 87)
        self.assertEqual(result["suggestions"], ["আরও মাপ যোগ করুন"])
        self.assertFalse(result["simulated"])
        self.assertEqual(json.loads(mock_urlopen.call_args.args[0].data)["response_format"], {"type": "json_object"})


class AuthenticationTests(unittest.TestCase):
    def test_user_id_header_is_rejected_outside_demo_mode(self):
        with SessionLocal() as db:
            with self.assertRaises(HTTPException) as error:
                resolve_user(db, None, 1, demo_mode=False)
        self.assertEqual(error.exception.status_code, 401)

    def test_bearer_token_resolves_its_user(self):
        engine = create_engine("sqlite://")
        Base.metadata.create_all(engine)
        test_session = sessionmaker(bind=engine)()
        try:
            user = User(name="Test Admin", email="admin@example.test", password_hash=hash_password("test-password"), role="admin")
            test_session.add(user)
            test_session.commit()
            token = issue_session(test_session, user)
            resolved = resolve_user(test_session, f"Bearer {token}", None, demo_mode=False)
            self.assertEqual(resolved.email, "admin@example.test")
            logout(f"Bearer {token}", test_session, user)
            with self.assertRaises(HTTPException) as error:
                resolve_user(test_session, f"Bearer {token}", None, demo_mode=False)
            self.assertEqual(error.exception.status_code, 401)
        finally:
            test_session.close()
            engine.dispose()


class OrderAuthorizationTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite://")
        Base.metadata.create_all(self.engine)
        self.db = sessionmaker(bind=self.engine)()
        password_hash = hash_password("test-password")
        self.buyer = User(name="Buyer One", email="buyer1@example.test", password_hash=password_hash, role="buyer")
        self.other_buyer = User(name="Buyer Two", email="buyer2@example.test", password_hash=password_hash, role="buyer")
        self.artisan = User(name="Artisan One", email="artisan1@example.test", password_hash=password_hash, role="artisan")
        self.other_artisan = User(name="Artisan Two", email="artisan2@example.test", password_hash=password_hash, role="artisan")
        self.admin = User(name="Test Admin", email="admin@example.test", password_hash=password_hash, role="admin")
        self.db.add_all([self.buyer, self.other_buyer, self.artisan, self.other_artisan, self.admin])
        self.db.commit()
        amounts = calculate_order(20, 100, "Dhaka")
        self.own_order = Order(buyer_id=self.buyer.id, artisan_id=self.artisan.id, product="Own order", quantity=20, unit_price=100, zone="Dhaka", **{key: amounts[key] for key in ("subtotal", "delivery_charge", "advance_amount", "balance_amount")})
        self.other_order = Order(buyer_id=self.other_buyer.id, artisan_id=self.other_artisan.id, product="Other order", quantity=20, unit_price=100, zone="Dhaka", **{key: amounts[key] for key in ("subtotal", "delivery_charge", "advance_amount", "balance_amount")})
        self.open_order = Order(buyer_id=self.other_buyer.id, artisan_id=None, product="Unassigned order", quantity=20, unit_price=100, zone="Dhaka", **{key: amounts[key] for key in ("subtotal", "delivery_charge", "advance_amount", "balance_amount")})
        self.db.add_all([self.own_order, self.other_order, self.open_order])
        self.db.commit()

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def test_buyer_sees_only_their_own_orders(self):
        orders = list_orders(self.db, actor=self.buyer)
        self.assertEqual([order["id"] for order in orders], [self.own_order.id])

    def test_artisan_sees_assigned_and_unassigned_orders(self):
        orders = list_orders(self.db, actor=self.artisan)
        self.assertEqual({order["id"] for order in orders}, {self.own_order.id, self.open_order.id})

    def test_artisan_cannot_update_another_artisans_shipment(self):
        with self.assertRaises(HTTPException) as error:
            update_shipment(self.other_order.id, ShipmentUpdate(status="Processing"), self.db, self.artisan)
        self.assertEqual(error.exception.status_code, 403)

    def test_buyer_can_confirm_only_their_own_advance_once(self):
        with self.assertRaises(HTTPException) as error:
            simulate_payment(self.other_order.id, self.db, self.buyer)
        self.assertEqual(error.exception.status_code, 403)

        result = simulate_payment(self.own_order.id, self.db, self.buyer)
        self.assertTrue(result["simulated"])
        self.assertEqual(self.db.query(Payment).filter_by(order_id=self.own_order.id).count(), 1)
        with self.assertRaises(HTTPException) as error:
            simulate_payment(self.own_order.id, self.db, self.buyer)
        self.assertEqual(error.exception.status_code, 409)

    def test_buyer_cannot_view_another_buyers_receipt(self):
        with self.assertRaises(HTTPException) as error:
            order_receipt(self.other_order.id, self.db, self.buyer)
        self.assertEqual(error.exception.status_code, 403)

    def test_admin_verification_decision_updates_user(self):
        verification = Verification(user_id=self.other_buyer.id, document_name="trade-document.pdf")
        self.db.add(verification)
        self.db.commit()

        result = decide_verification(verification.id, VerificationDecision(status="Approved"), self.db, self.admin)

        self.assertEqual(result["status"], "Approved")
        self.db.refresh(self.other_buyer)
        self.assertTrue(self.other_buyer.verified)

    def test_wholesale_order_requires_at_least_twenty_pieces(self):
        with self.assertRaises(ValidationError):
            OrderRequest(product="Handwoven runner", quantity=19, unit_price=100, zone="Dhaka")

    def test_order_cannot_assign_a_non_artisan_as_maker(self):
        payload = OrderRequest(product="Handwoven runner", quantity=20, unit_price=100, zone="Dhaka", artisan_id=self.other_buyer.id)
        with self.assertRaises(HTTPException) as error:
            create_order(payload, self.db, self.buyer)
        self.assertEqual(error.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()