from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
import cloudinary.uploader
import tempfile
import os
from decouple import config
from groq import Groq
from .models import Scan, Disease
from .serializers import ScanSerializer, DiseaseSerializer
from .predictor import predict_disease

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_scan(request):
    image_file = request.FILES.get('image')
    latitude = request.data.get('latitude', None)
    longitude = request.data.get('longitude', None)

    if not image_file:
        return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

    # Save image temporarily for AI prediction
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
        for chunk in image_file.chunks():
            tmp.write(chunk)
        tmp_path = tmp.name

    # Predict disease using AI model
    prediction = predict_disease(tmp_path)
    disease_name = prediction['disease_name']
    confidence_score = prediction['confidence_score']

    # Delete temp file
    os.remove(tmp_path)

    # Upload image to Cloudinary
    image_file.seek(0)
    upload_result = cloudinary.uploader.upload(image_file)
    image_url = upload_result['secure_url']

    # Get remedy from Groq API
    client = Groq(api_key=config('GROQ_API_KEY'))
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"""A farmer's crop has been diagnosed with {disease_name}.
                Please provide:
                1. A brief remedy in English (2-3 sentences)
                2. The same remedy in Tamil language

                Format your response exactly like this:
                ENGLISH: [remedy in english]
                TAMIL: [remedy in tamil]"""
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    response_text = chat_completion.choices[0].message.content
    remedy_english = ''
    remedy_tamil = ''

    for line in response_text.split('\n'):
        if line.startswith('ENGLISH:'):
            remedy_english = line.replace('ENGLISH:', '').strip()
        elif line.startswith('TAMIL:'):
            remedy_tamil = line.replace('TAMIL:', '').strip()

    # Save scan to database
    scan = Scan.objects.create(
        user=request.user,
        image_url=image_url,
        disease_name=disease_name,
        confidence_score=confidence_score,
        remedy_english=remedy_english,
        remedy_tamil=remedy_tamil,
        latitude=latitude,
        longitude=longitude,
    )

    return Response(ScanSerializer(scan).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def scan_history(request):
    scans = Scan.objects.filter(user=request.user).order_by('-created_at')
    serializer = ScanSerializer(scans, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def disease_list(request):
    diseases = Disease.objects.all()
    serializer = DiseaseSerializer(diseases, many=True)
    return Response(serializer.data)