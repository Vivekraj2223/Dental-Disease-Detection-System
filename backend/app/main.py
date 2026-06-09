from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from app.predict import predict_image
from app.disease_info import DISEASE_INFO

app = FastAPI(
    title="Dental Disease Detection API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Dental Disease Detection API Running"
    }


@app.get("/diseases")
def get_diseases():
    return DISEASE_INFO


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    image = Image.open(
        io.BytesIO(contents)
    )

    result = predict_image(image)

    disease = result["disease"]

    if disease in DISEASE_INFO:
        result["info"] = DISEASE_INFO[disease]

    return result