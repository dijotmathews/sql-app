import os

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func, text
from flask_validate_json import validate_json
from flask_cors import CORS


basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] =\
    'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


schema = {
    "type": "object",
    "properties": {
        "query": {"type": "string"},

    },
    "required": ["query"]
}


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(80),  nullable=False)
    age = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    bio = db.Column(db.Text)

    def __repr__(self):
        return f'<Student {self.firstname}>'


@app.route("/v1/api/run", methods=['POST'])
@validate_json(schema)
def run_query():
    try:
        query = request.json['query']
        r = db.session.execute(text(query))
        c = []
        rk = r.keys()
        results = []
        for k in rk:
            c.append(k)

        users_rows = r.fetchall()
        for row in users_rows:
            results.append(dict(zip(rk, row)))

        response = {"message": "Success", "data": results, "columns": c}

        return jsonify(response)
    except Exception as e:
        error = {'message': str(e)}
        return jsonify(error), 500


if __name__ == '__main__':
    app.run(debug=True, port=9090)
