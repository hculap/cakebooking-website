import os
import openai
import requests
from dotenv import load_dotenv

def generate_and_save_image():
    """
    Prompts the user for an image description and filename,
    generates the image using OpenAI's DALL-E 3, and saves it.
    """
    # --- Load API Key ---
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print("Error: OPENAI_API_KEY not found in .env file.")
        print("Please create a .env file and add your key: OPENAI_API_KEY='your-key-here'")
        return

    try:
        client = openai.OpenAI(api_key=api_key)
    except Exception as e:
        print(f"Error initializing OpenAI client: {e}")
        return

    # --- Get User Input ---
    print("\n--- OpenAI Image Generator ---")
    prompt = input("Enter a detailed description for the image you want to generate:\n> ")

    if not prompt:
        print("Prompt cannot be empty. Aborting.")
        return

    filename = input("Enter a filename for the image (e.g., 'hero-cake-2'):\n> ")
    if not filename:
        print("Filename cannot be empty. Aborting.")
        return

    # --- Generate Image ---
    print(f"\n🎨 Generating image for: '{prompt}'...")
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",  # You can change this to "1792x1024" or "1024x1792"
            quality="standard", # "standard" or "hd"
            n=1,
        )
        image_url = response.data[0].url
        print("✅ Image generated successfully!")
    except openai.APIError as e:
        print(f"❌ OpenAI API Error: {e}")
        return
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        return

    # --- Download and Save Image ---
    print(f"⬇️ Downloading image from URL: {image_url}")
    try:
        image_response = requests.get(image_url, timeout=60)
        image_response.raise_for_status()  # Raise an exception for bad status codes

        # Ensure the 'images' directory exists
        if not os.path.exists('images'):
            os.makedirs('images')

        # Save the image
        file_path = os.path.join('images', f"{filename}.png")
        with open(file_path, 'wb') as f:
            f.write(image_response.content)
        
        print(f"✨ Success! Image saved to: {file_path}")

    except requests.RequestException as e:
        print(f"❌ Error downloading image: {e}")
    except IOError as e:
        print(f"❌ Error saving image to file: {e}")


if __name__ == "__main__":
    while True:
        generate_and_save_image()
        another = input("\nGenerate another image? (y/n): ").lower()
        if another != 'y':
            print("👋 Goodbye!")
            break 