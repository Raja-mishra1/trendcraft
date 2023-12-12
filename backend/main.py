from openai import OpenAI

from fastapi import FastAPI
import serpapi
from uvicorn import Config, Server
from fastapi import Request, status
from fastapi.middleware.cors import CORSMiddleware

import asyncio
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

OPEN_AI_KEY = os.getenv("OPEN_AI_KEY")
SERP_API_KEY = os.getenv("SERP_API_KEY")


app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Add your frontend's origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can specify specific HTTP methods if needed
    allow_headers=["*"],  # You can specify specific HTTP headers if needed
)


@app.post("/trends/")
async def fetch_trends(request: Request):
    data = await request.json()
    q = data["query"]
    serpapi_client = serpapi.Client(api_key=SERP_API_KEY)
    search_result_related_queries  = serpapi_client.search(q=q, engine="google_trends", data_type= "RELATED_QUERIES", location="India, Mumbai")
    search_result_by_interest = serpapi_client.search(q=q, engine="google_trends", location="India, Mumbai")
    response  = {
        "related_queries": search_result_related_queries.get("related_queries",""),
        "by_interest": search_result_by_interest.get("interest_over_time","")
    }
    return response


@app.post("/style/")
async def generate_syle(request: Request):
    data = await request.json()
    prompt = data["query"]
    client = OpenAI(api_key=OPEN_AI_KEY)
    response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
                )
    print(response.data)
    image_url = response.data[0].url
    return image_url

@app.post("/style/variations/")
async def generate_variations(request: Request):
    data = await request.json()
    prompt = data["query"]
    image = data["image"]
    client = OpenAI(api_key=OPEN_AI_KEY)
    response = client.images.generate(
                image=image,
                model="dall-e-2",
                prompt=prompt,
                n=4,
                size="1024x1024",
            )
    print(response.data)
    image_url = response.data[0].url
    return image_url



@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        Server(
            Config(app=app, host="0.0.0.0", loop=loop, port=5000)
        ).serve()
    )
