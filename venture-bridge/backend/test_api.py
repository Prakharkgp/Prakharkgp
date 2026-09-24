from fastapi.testclient import TestClient
import sys

from app import app

client = TestClient(app)

def test_veille_pipeline():
    print("Sending POST request to /api/veille...")
    response = client.post("/api/veille", json={"client_id": "1532378"})
    
    if response.status_code != 200:
        print(f"ERROR! Status code: {response.status_code}")
        print("Response body:", response.text)
        sys.exit(1)
        
    data = response.json()
    print("\n✅ Success! Received 200 OK.")
    print("\n--- SYNTHESE ---\n")
    print(data.get("synthese", "No synthese found"))

if __name__ == "__main__":
    test_veille_pipeline()
