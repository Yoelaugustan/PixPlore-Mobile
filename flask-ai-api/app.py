from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision.models import mobilenet_v3_large, MobileNet_V3_Large_Weights
from openai import OpenAI
import os
import json
import base64
from io import BytesIO
import tempfile
from PIL import Image
from supabase import create_client, Client
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Configuration - Use environment variables in production
SUPABASE_URL = os.getenv("SUPABASE_URL", "your-supabase-url")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "your-supabase-service-role-key")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key")
STORAGE_BUCKET = "flashcards"

# Initialize clients
if SUPABASE_URL != "your-supabase-url":
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
if OPENAI_API_KEY != "your-openai-api-key":
    client = OpenAI(api_key=OPENAI_API_KEY)

# Load MobileNet model
weights = MobileNet_V3_Large_Weights.DEFAULT
model = mobilenet_v3_large(weights=weights)
model.eval()
preprocess = weights.transforms()

def get_spelled_and_description_word(word):
    """Get spelling and description from OpenAI"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful kindergarten teacher. Provide simple explanations for children."},
                {"role": "user", "content": f"For the word '{word}', provide: 1) Individual letters for spelling, 2) A simple 1-2 sentence description that children can understand. Format as JSON with 'spelling' (array of letters) and 'description' (string)."}
            ],
            temperature=0.2
        )
        
        content = response.choices[0].message.content
        try:
            parsed = json.loads(content)
            return parsed
        except:
            letters = list(word.upper())
            return {
                "spelling": letters,
                "description": f"A {word} is something you can see and learn about!"
            }
    except Exception as e:
        print(f"OpenAI error: {e}")
        letters = list(word.upper())
        return {
            "spelling": letters,
            "description": f"A {word} is something interesting to learn about!"
        }

def upload_to_supabase_storage(image_data, user_email):
    """Upload base64 image to Supabase Storage"""
    try:
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{user_email.replace('@', '_').replace('.', '_')}/{timestamp}_{unique_id}.jpg"
        
        result = supabase.storage.from_(STORAGE_BUCKET).upload(
            path=filename,
            file=image_bytes,
            file_options={"content-type": "image/jpeg"}
        )
        
        if result.status_code != 200:
            print(f"Upload error: {result}")
            return None
        
        public_url_result = supabase.storage.from_(STORAGE_BUCKET).get_public_url(filename)
        return public_url_result
        
    except Exception as e:
        print(f"Supabase storage upload error: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "PixPlore AI API with Supabase Storage is running",
        "storage_bucket": STORAGE_BUCKET
    })

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        
        if 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        user_email = data.get('user_email', 'anonymous@example.com')
        image_base64 = data['image']
        
        print(f"Processing image for user: {user_email}")
        
        # Convert base64 to PIL Image for AI analysis
        image_data = image_base64.split(',')[1] if ',' in image_base64 else image_base64
        image_bytes = base64.b64decode(image_data)
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        
        # Classify image using MobileNet
        batch = preprocess(img).unsqueeze(0)
        prediction = model(batch).squeeze(0).softmax(0)
        class_id = prediction.argmax().item()
        score = prediction[class_id].item()
        category_name = weights.meta["categories"][class_id]
        
        category_name = category_name.replace('_', ' ').title()
        
        print(f"Detected: {category_name} ({100 * score:.1f}%)")
        
        image_url = upload_to_supabase_storage(image_base64, user_email)
        
        if not image_url:
            return jsonify({"error": "Failed to upload image"}), 500
        
        spell_data = get_spelled_and_description_word(category_name)
        
        spelling_sentence = f"Let's learn together! The word is {category_name}. Let's spell it: {' - '.join(spell_data['spelling']).upper()}. {spell_data['description']}"
        
        try:
            tts_response = client.audio.speech.create(
                model="tts-1",
                voice="nova",
                input=spelling_sentence,
                response_format="mp3"
            )
            audio_base64 = base64.b64encode(tts_response.content).decode('utf-8')
        except Exception as e:
            print(f"TTS error: {e}")
            audio_base64 = None
        
        return jsonify({
            "success": True,
            "predicted_name": category_name,
            "confidence": round(score * 100, 1),
            "spelling": spell_data['spelling'],
            "description": spell_data['description'],
            "image_url": image_url,
            "audio_base64": audio_base64,
            "spelling_sentence": spelling_sentence
        })
        
    except Exception as e:
        print(f"Error in analyze_image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"🚀 Starting PixPlore AI API with Supabase Storage (bucket: {STORAGE_BUCKET})")
    app.run(host='0.0.0.0', port=5000, debug=True)