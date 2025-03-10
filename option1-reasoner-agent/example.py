import os
import subprocess

# Set Azure OpenAI environment variables
os.environ["AZURE_API_KEY"] = "e78c273f6f844dd2bb0f00fdba023b6a"
os.environ["AZURE_API_BASE"] = "https://thirdwishgroup-ai.openai.azure.com"
os.environ["AZURE_API_VERSION"] = "2024-08-01-preview"

# Change directory to ReasonerAgent-Web
os.chdir("/content/llm-reasoners/examples/ReasonerAgent-Web/")

# Run the main.py script with arguments
subprocess.run([
    "python", "main.py", "test_job",
    "--query", "Quién es el presidente de EEUU",
    "--api_key", "e78c273f6f844dd2bb0f00fdba023b6a",
    "--model", "gpt-4o"
])
