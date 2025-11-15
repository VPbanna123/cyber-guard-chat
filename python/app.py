
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uvicorn
from collections import defaultdict, deque

app = FastAPI(
    title="Cyberbullying Detection API",
    version="1.0.0"
)

MODEL_PATH = r"C:\Users\vijay\OneDrive\Desktop\cyber\GuardianAI\python\model"

try:
    print(f"Loading model from: {MODEL_PATH}")
    classifier = pipeline(
        "text-classification",
        model=MODEL_PATH,
        tokenizer=MODEL_PATH,
        device=0 if os.getenv("CUDA_VISIBLE_DEVICES") else -1
    )
    print(" Model loaded successfully!")
except Exception as e:
    print(f"!!! Error loading model: {e} !!!")
    classifier = None

conversation_history = defaultdict(lambda: deque(maxlen=10))
conversation_scores = defaultdict(lambda: deque(maxlen=3))

class Message(BaseModel):
    conversation_id: str
    text: str

class AnalysisResponse(BaseModel):
    status: str
    is_bullying: bool
    confidence_score: float
    alert_triggered: bool  # 🔥 MAKE SURE THIS IS HERE!
    consecutive_high_scores: int

@app.post("/analyze-conversation", response_model=AnalysisResponse)
async def analyze_message(message: Message):
    print(f"\n{'='*70}")
    print(f"📩 NEW REQUEST")
    print(f"   conversation_id: {message.conversation_id}")
    print(f"   text: {message.text}")
    
    if not classifier:
        print(" Model not available!")
        raise HTTPException(status_code=500, detail="Model is not available.")

    # Update history
    conversation_history[message.conversation_id].append(message.text)
    contextual_text = " . ".join(conversation_history[message.conversation_id])
    
    print(f"   context: {contextual_text}")

    # Run model
    try:
        result = classifier(contextual_text)[0]
        is_bullying = True if result['label'] == 'LABEL_1' else False
        confidence_score = result['score'] if is_bullying else 1.0 - result['score']
        print(f"🤖 Model: {result['label']}, confidence: {confidence_score:.4f}")
    except Exception as e:
        print(f" Model error: {e}")
        raise HTTPException(status_code=500, detail=f"Model inference failed: {e}")

    # Track scores
    alert_triggered = False
    consecutive_high_scores = 0
    
    if is_bullying and confidence_score > 0.7:
        conversation_scores[message.conversation_id].append(confidence_score)
        print(f" Score added: {confidence_score:.4f}")
    else:
        conversation_scores[message.conversation_id].clear()
        print(f" Score cleared")
    
    recent_scores = list(conversation_scores[message.conversation_id])
    consecutive_high_scores = len(recent_scores)
    
    print(f"📊 Scores: {consecutive_high_scores}/3")
    
    if len(recent_scores) == 3 and all(score > 0.85 for score in recent_scores):
        alert_triggered = True
        print(f"🚨 ALERT TRIGGERED!")
        conversation_scores[message.conversation_id].clear()
    
    # 🔥 CONVERT TO PYTHON NATIVE TYPES!
    response_data = {
        "status": "analyzed",
        "is_bullying": bool(is_bullying),  # Ensure boolean
        "confidence_score": float(confidence_score),  # Ensure float
        "alert_triggered": bool(alert_triggered),  # 🔥 ENSURE BOOLEAN!
        "consecutive_high_scores": int(consecutive_high_scores)  # Ensure int
    }
    
    print(f" Response: {response_data}")
    print(f"{'='*70}\n")
    
    return response_data

@app.get("/")
def read_root():
    return {"status": "API running"}

if __name__ == "__main__":
    print("\n ML API starting on http://0.0.0.0:8000\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
