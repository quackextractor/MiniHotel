from flask import Blueprint, request, jsonify
from database import db, Event
from schemas import EventSchema
from utils import token_required

event_bp = Blueprint('event', __name__, url_prefix='/api/events')
event_schema = EventSchema()
events_schema = EventSchema(many=True)

@event_bp.route('', methods=['GET'])
@token_required
def get_events(current_user):
    events = Event.query.all()
    return jsonify(events_schema.dump(events))

@event_bp.route('', methods=['POST'])
@token_required
def create_event(current_user):
    try:
        from datetime import datetime
        event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
    except (ValueError, KeyError):
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

    new_event = Event(
        name=data['name'],
        event_date=event_date,
        space=data['space'],
        status=data.get('status', 'scheduled'),
        expected_guests=data.get('expected_guests')
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify(event_schema.dump(new_event)), 201

@event_bp.route('/<int:event_id>', methods=['GET'])
@token_required
def get_event(current_user, event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event_schema.dump(event))
