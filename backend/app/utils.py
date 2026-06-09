from PIL import Image
from torchvision import transforms

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    tensor = transform(image)
    tensor = tensor.unsqueeze(0)
    return tensor