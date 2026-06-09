import torch
import torch.nn as nn
from torchvision import models

CLASS_NAMES = [
    "Calculus",
    "Gingivitis",
    "Mouth Ulcer",
    "Tooth Discoloration",
    "caries",
    "hypodontia",
    "non_dental"
]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_model():
    model = models.mobilenet_v2(weights=None)

    model.classifier[1] = nn.Linear(
        model.last_channel,
        len(CLASS_NAMES)
    )

    model.load_state_dict(
        torch.load(
            "best_dental_model.pth",
            map_location=device
        )
    )

    model.to(device)
    model.eval()

    return model


model = load_model()