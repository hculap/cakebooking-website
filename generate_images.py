import os
import openai
import requests
import argparse
from dotenv import load_dotenv

def initialize_client():
    """Loads API key and initializes the OpenAI client."""
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print("Error: OPENAI_API_KEY not found in .env file.")
        print("Please create a .env file and add your key: OPENAI_API_KEY='your-key-here'")
        return None

    try:
        return openai.OpenAI(api_key=api_key)
    except Exception as e:
        print(f"Error initializing OpenAI client: {e}")
        return None

def generate_image(client, prompt, filename, size="1024x1024"):
    """
    Generates an image based on the prompt and saves it with the given filename.
    """
    print(f"\n🎨 Generating image ({size}) for: '{prompt}'...")
    try:
        response = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size=size,
            quality="high",
            n=1,
        )
        # Handle base64 image data from gpt-image-1 model
        if hasattr(response.data[0], 'b64_json') and response.data[0].b64_json:
            print("📦 Image returned as base64 data, decoding...")
            import base64
            image_data = base64.b64decode(response.data[0].b64_json)
            
            if not os.path.exists('images'):
                os.makedirs('images')

            file_path = os.path.join('images', f"{filename}.png")
            with open(file_path, 'wb') as f:
                f.write(image_data)
            
            print(f"✨ Success! Image saved to: {file_path}")
            return
        
        # Handle URL-based response (for other models)
        elif hasattr(response.data[0], 'url') and response.data[0].url:
            image_url = response.data[0].url
        else:
            print(f"❌ Unexpected response format. Available attributes: {dir(response.data[0])}")
            return
            
        print("✅ Image generated successfully!")
    except openai.APIError as e:
        print(f"❌ OpenAI API Error: {e}")
        return
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        return

    print(f"⬇️ Downloading image from URL: {image_url}")
    try:
        image_response = requests.get(image_url, timeout=60)
        image_response.raise_for_status()

        if not os.path.exists('images'):
            os.makedirs('images')

        file_path = os.path.join('images', f"{filename}.png")
        with open(file_path, 'wb') as f:
            f.write(image_response.content)
        
        print(f"✨ Success! Image saved to: {file_path}")

    except requests.RequestException as e:
        print(f"❌ Error downloading image: {e}")
    except IOError as e:
        print(f"❌ Error saving image to file: {e}")

def run_interactive_mode(client):
    """Runs the script in a continuous interactive loop."""
    while True:
        print("\n--- OpenAI Image Generator ---")
        prompt = input("Enter a detailed description for the image:\n> ")
        if not prompt:
            print("Prompt cannot be empty. Aborting.")
            continue

        filename = input("Enter a filename for the image (e.g., 'hero-cake-2'):\n> ")
        if not filename:
            print("Filename cannot be empty. Aborting.")
            continue

        generate_image(client, prompt, filename)

        another = input("\nGenerate another image? (y/n): ").lower()
        if another != 'y':
            print("👋 Goodbye!")
            break

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate images using OpenAI's DALL-E 3.")
    parser.add_argument("-p", "--prompt", type=str, help="The prompt to generate the image from.")
    parser.add_argument("-f", "--filename", type=str, help="The filename for the saved image (without extension).")
    parser.add_argument("-s", "--size", type=str, default="1024x1024", help="The size of the image (e.g., '1024x1024', '1792x1024', '1024x1792').")
    args = parser.parse_args()

    client = initialize_client()
    
    if client:
        if args.prompt and args.filename:
            generate_image(client, args.prompt, args.filename, args.size)
        else:
            run_interactive_mode(client) 