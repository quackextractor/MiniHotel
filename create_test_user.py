from __init__ import create_app
from database import db, User
import bcrypt
import sys

# Ensure we can import from current directory
sys.path.append('.')

app = create_app()

with app.app_context():
    username = "test_user_verify"
    password = "password_verify_123"
    
    # Check if user exists
    existing = User.query.filter_by(username=username).first()
    if existing:
        # Update password if exists
        print(f"User {username} already exists, updating password.")
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        existing.password_hash = hashed.decode('utf-8')
    else:
        # Create new user
        print(f"Creating user {username}...")
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(username=username, password_hash=hashed.decode('utf-8'))
        db.session.add(new_user)
    
    db.session.commit()
    print(f"User {username} ready.")
