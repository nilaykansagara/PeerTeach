from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input
import numpy as np
import cv2
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

i = 0
def load_pretrained_model(model_path):
    return load_model(model_path)

def classify_frame(model, frame):
    # Preprocess the frame for model prediction
    img_array = cv2.resize(frame, (150, 150))  # Adjust target size if needed
    img_array = image.img_to_array(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Make a prediction
    prediction = model.predict(img_array)
    print(prediction[0][0])
    return prediction[0][0]

def classify_video(video_file, model):
    # # Create a VideoCapture object from the video bytes
    # cap = cv2.VideoCapture()
    # cap.open(video)

    # # Create a VideoCapture object from the video bytes
    # nparr = np.frombuffer(video_bytes.read(), np.uint8)
    # # cap = cv2.VideoCapture(cv2.IMREAD_UNCHANGED)
    # # cap.open(cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED))
    # cap = cv2.VideoCapture(cv2.imdecode(nparr, 1))

   # Save the file to a temporary location
    temp_video_path = 'my_video.mp4'  # You can use a better naming strategy
    video_file.save(temp_video_path)

    # Create a VideoCapture object from the temporary file
    cap = cv2.VideoCapture(temp_video_path)

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Choose a number of frames between 40 and 70, evenly distributed across the video
    num_frames = min(max(40, frame_count), 70)
    selected_frame_indices = np.linspace(0, frame_count - 1, num=num_frames, dtype=int)

    study_related_scores = []

    for i in selected_frame_indices:
        # Set the frame position
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)

        # Read the frame
        ret, frame = cap.read()

        if not ret:
            break

        # Classify the frame
        frame_score = classify_frame(model, frame)

        if frame_score is not None:  # Check if frame_score is not None before appending
            study_related_scores.append(frame_score)

    cap.release()

    if not study_related_scores:
        return 0  # Return 0 if there are no valid frame scores

    # Attempt to remove the temporary video file
    try:
        os.remove(temp_video_path)
        print(f"Temporary video file '{temp_video_path}' deleted successfully.")
    except FileNotFoundError:
        print(f"Error: Temporary video file '{temp_video_path}' not found.")
    except Exception as e:
        print(f"Error: Unable to delete temporary video file. {e}")

    # Calculate the average score
    avg_score = np.mean(study_related_scores)
    
    return 1 if avg_score >= 0.7 else 0

# Load the trained model
model_path = "../Flask_App/\PeerTeach_Trained_ML_Model.h5"
model = load_pretrained_model(model_path)

@app.route('/classify_video', methods=['POST'])
def classify_video_endpoint():
    print("I am in")
    if 'video' not in request.files:
        print("hii")
        return jsonify({'error': 'No file part'})

    file = request.files['video']

    if file.filename == '':
        print("hello")
        return jsonify({'error': 'No selected file'})

    print("Processing")
    # Perform video classification
    result = classify_video(file, model)
    print(result)
    if(result == 1):
        print("Video is Study Related")
    else:
        print("Video is Not Study Related")


    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
