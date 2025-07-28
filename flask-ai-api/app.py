from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision.models import mobilenet_v3_large, MobileNet_V3_Large_Weights
from openai import OpenAI
import os
import json
import base64
from io import BytesIO
from PIL import Image
from supabase import create_client, Client
from datetime import datetime
import uuid
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
STORAGE_BUCKET = "flashcards"

print(SUPABASE_ANON_KEY)
print(SUPABASE_URL)
print(OPENAI_API_KEY)


supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
client = OpenAI(api_key=OPENAI_API_KEY)

# Load MobileNet model
weights = MobileNet_V3_Large_Weights.DEFAULT
model = mobilenet_v3_large(weights=weights)
model.eval()
preprocess = weights.transforms()

def get_spelled_and_description_word(word):
    functions = [
        {
            "name": "spell_word",
            "description": "You are a helpful kindergarten teacher. Provide simple explanations for children.",
            "parameters": {
                "type": "object",
                "properties": {
                    "spelling": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Spell the word letter by letter so children could understand"
                    },
                    "description": {
                        "type": "string",
                        "description": f"Describe the {word} in around 1 to 3 short sentences that is understandable for children"
                    }
                },
                "required": ["spelling", "description"]
            }
        }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful kindergarten teacher. Provide simple explanations for children."},
                {"role": "user", "content": f"For the word '{word}', provide: 1) Individual letters for spelling, 2) A simple 1-2 sentence description that children can understand"}
            ],
            functions=functions,
            temperature=0.2
        )
        
        try:
            args = response.choices[0].message.function_call.arguments
            parsed = json.loads(args)
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
    try:
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{user_email.replace('@', '_').replace('.', '_')}/{timestamp}_{unique_id}.jpg"
        
        try:
            result = supabase.storage.from_(STORAGE_BUCKET).upload(
                path=filename,
                file=image_bytes,
                file_options={"content-type": "image/jpeg"}
            )
            print("Upload succeeded.")
        except Exception as e:
            print(f"Upload error: {e}")
            return None
        
        public_url_result = supabase.storage.from_(STORAGE_BUCKET).get_public_url(filename)
        return public_url_result
        
    except Exception as e:
        print(f"Supabase storage upload error: {e}")
        return None
    
def save_to_supabase_database(user_id, image_url, word):
    """Save to simplified flashcard table: id, user_id, label, image_url"""
    try:        
        data = {
            "user_id": user_id,
            "label": word.upper(),
            "image_url": image_url
        }
        
        result = supabase.table('flashcard').insert(data).execute()
        return result.data
        
    except Exception as e:
        print(f"Supabase database save error: {e}")
        return None

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        
        if 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        if 'user_id' not in data:
            return jsonify({"error": "No user_id provided"}), 400
        
        user_id = data.get('user_id')
        image_base64 = data['image']
        
        print(f"Processing image for user_id: {user_id}")
        
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
        
        # Clean up category name
        category_name = category_name.replace('_', ' ').title()
        
        print(f"Detected: {category_name} ({100 * score:.1f}%)")
        
        # Upload image to Supabase Storage (using user_id folder)
        image_url = upload_to_supabase_storage(image_base64, user_id)
        
        if not image_url:
            return jsonify({"error": "Failed to upload image"}), 500
        
        print(f"Image uploaded successfully: {image_url}")
        
        save_result = save_to_supabase_database(
            user_id, 
            image_url, 
            category_name
        )
        
        # Generate spelling and description (for display only, not stored)
        spell_data = get_spelled_and_description_word(category_name)
        
        print(f"Generated temporary content - Spelling: {spell_data['spelling']}, Description: {spell_data['description']}")
        
        return jsonify({
            "success": True,
            "predicted_name": category_name,
            "confidence": round(score * 100, 1),
            "spelling": spell_data['spelling'],
            "description": spell_data['description'],
            "image_url": image_url,
            "saved_to_db": save_result is not None,
            "user_id": user_id,
            "display_data": {
                "word": category_name,
                "spelling": spell_data['spelling'],
                "description": spell_data['description']
            }
        })
        
    except Exception as e:
        print(f"Error in analyze_image: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/generate-tts', methods=['POST'])
def generate_tts():
    """Separate endpoint for TTS generation - called after display"""
    try:
        data = request.json
        
        if 'word' not in data or 'spelling' not in data or 'description' not in data:
            return jsonify({"error": "Missing word, spelling, or description"}), 400
        
        word = data['word']
        spelling = data['spelling']
        description = data['description']
        
        # Generate TTS
        spelling_sentence = f"Are You Ready Kids, Let's Spell This Together!: {' - '.join(spelling).upper()}. {description}"
        
        print(f"Generating TTS for: {word}")
        
        try:
            tts_response = client.audio.speech.create(
                model="gpt-4o-mini-tts",
                voice="nova",
                input=spelling_sentence,
                response_format="mp3"
            )
            audio_base64 = base64.b64encode(tts_response.content).decode('utf-8')
            
            return jsonify({
                "success": True,
                "audio_base64": audio_base64,
                "spelling_sentence": spelling_sentence,
                "word": word
            })
            
        except Exception as e:
            print(f"TTS error: {e}")
            return jsonify({"error": f"TTS generation failed: {str(e)}"}), 500
        
    except Exception as e:
        print(f"Error in generate_tts: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "message": "PixPlore API is healthy!",
        "table_schema": "flashcard(user_id, label, image_url)"
    })

if __name__ == '__main__':
    print(f"🚀 Starting PixPlore AI API with Supabase anon key")
    print(f"📦 Storage bucket: {STORAGE_BUCKET}")
    app.run(host='0.0.0.0', port=5000, debug=True)