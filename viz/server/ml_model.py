import pandas as pd
import json
import os
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis
from lightgbm import LGBMClassifier
import joblib  # For saving and loading model weights

# Path to save the model weights
MODEL_PATH = "best_model.pkl"

# Function to train and save the best model
def train_and_save_model():
    # Load the dataset
    df = pd.read_csv("./data.csv")

    # Preprocess the Gender column
    if "Gender" in df.columns:
        df["Gender"] = df["Gender"].fillna("Not Specified")  # Fill missing values with "Not Specified"
        encode = LabelEncoder()
        encode.fit(["Male", "Female", "Not Specified"])  # Define all possible categories
        df["Gender"] = encode.transform(df["Gender"])
        encoders = {"Gender": encode}  # Save the encoder for Gender

    # Remove rows where Gender is "Not Specified"
    df = df[df["Gender"] != "Not Specified"]

    # Encode other categorical variables
    for column in df.columns:
        if df[column].dtypes == "object" and column != "Gender":
            encode = LabelEncoder()
            df[column] = encode.fit_transform(df[column])
            encoders[column] = encode  # Save the encoder for this column

    # Save the encoders to a file
    joblib.dump(encoders, "encoders.pkl")
    print("Encoders saved to encoders.pkl")

    # Split the dataset
    x = df.drop(columns=["Depression"])
    y = df["Depression"]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=42)

    # Define the models
    model_list = [
        ("logistic", LogisticRegression()),
        ("decision_tree", DecisionTreeClassifier(ccp_alpha=0.001)),
        ("random_forest", RandomForestClassifier()),
        ("gradient_boosting", GradientBoostingClassifier()),
        ("ada_boost", AdaBoostClassifier()),
        ("svc", SVC(probability=True)),
        ("gaussian_nb", GaussianNB()),
        ("k_neighbors", KNeighborsClassifier()),
        ("lda", LinearDiscriminantAnalysis()),
        ("qda", QuadraticDiscriminantAnalysis()),
        ("lgbm", LGBMClassifier(verbose=-1)),
    ]

    # Use a VotingClassifier with all models
    model = VotingClassifier(estimators=model_list, voting="soft")
    model.fit(x_train, y_train)

    # Evaluate the model
    y_pred = model.predict(x_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy}")

    # Save the model to a file
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

    return accuracy

# Function to load the model and make predictions
def predict_from_user_profile():
    # Check if the model exists
    if not os.path.exists(MODEL_PATH):
        print("Model not found. Training a new model...")
        train_and_save_model()

    # Load the model
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")

    # Load the encoders
    encoders = joblib.load("encoders.pkl")
    print("Encoders loaded successfully.")

    if "Gender" in encoders:
        print(f"Known classes for 'Gender': {encoders['Gender'].classes_}")

    # Load the user profile
    with open("user_profile.json", "r") as json_file:
        user_profile = json.load(json_file)

    # Handle missing or unspecified Gender
    if "Gender" in user_profile:
        if user_profile["Gender"] is None or user_profile["Gender"] == "":
            user_profile["Gender"] = "Not Specified"

    # Remove the 'Actual Depression' field if it exists
    if "Actual Depression" in user_profile:
        del user_profile["Actual Depression"]

    # Convert the user profile into a DataFrame
    test_vector = pd.DataFrame([user_profile])

    # Apply encoders to the DataFrame
    for column, encoder in encoders.items():
        if column in test_vector.columns:
            try:
                test_vector[column] = encoder.transform(test_vector[column])
            except ValueError:
                # Handle unseen categories by assigning a default value
                test_vector[column] = -1

    print(f"Encoded test vector:\n{test_vector}")

    # Save the encoded test vector to a CSV file
    test_vector.to_csv("encoded_test_vector.csv", index=False)
    print("Encoded test vector saved to 'encoded_test_vector.csv'")

    # Ensure the order of features matches the training dataset
    test_vector = test_vector[[
        "Gender",
        "Age",
        "Academic Pressure",
        "Study Satisfaction",
        "Sleep Duration",
        "Dietary Habits",
        "Have you ever had suicidal thoughts ?",
        "Study Hours",
        "Financial Stress",
        "Family History of Mental Illness"
    ]]

    # Make predictions
    prediction = model.predict(test_vector)
    prediction_proba = model.predict_proba(test_vector)

    return {
        "classification": int(prediction[0]),
        "probability": prediction_proba.tolist()
    }

if __name__ == "__main__":
    print("Training and saving the model...")
    accuracy = train_and_save_model()
    print(f"Training completed. Model accuracy: {accuracy}")

