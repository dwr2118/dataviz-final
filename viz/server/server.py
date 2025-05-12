from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from ml_model import predict_from_user_profile

app = Flask(__name__)

# Enable CORS for all routes and allow all origins
CORS(app)  # Allow all origins

# Route to save the user profile JSON and make predictions
@app.route('/save-profile', methods=['POST', 'OPTIONS'])
def save_profile():
    if request.method == 'OPTIONS': 
        # Handle preflight request
        response = jsonify({"message": "Preflight request allowed"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    try:
        # Get the JSON data from the request
        user_profile = request.get_json()

        # Save the JSON data to a file
        with open('user_profile.json', 'w') as json_file:
            json.dump(user_profile, json_file, indent=2)

        # Run the prediction
        prediction_result = predict_from_user_profile()

        return jsonify({
            "success": True,
            "message": "User profile saved and prediction made!",
            "prediction": prediction_result.get("classification"),
            "probability": prediction_result.get("probability", None)
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3005, debug=True)