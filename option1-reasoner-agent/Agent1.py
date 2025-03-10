import os
import subprocess
import gradio as gr

# Configurar variables de entorno para Azure
os.environ["AZURE_API_KEY"] = "e78c273f6f844dd2bb0f00fdba023b6a"
os.environ["AZURE_API_BASE"] = "https://thirdwishgroup-ai.openai.azure.com"
os.environ["AZURE_API_VERSION"] = "2024-08-01-preview"
AZURE_API_KEY = os.environ["AZURE_API_KEY"]

# Ruta del repositorio de ReasonerAgent (ajusta según tu entorno)
REASONER_DIR = "/content/llm-reasoners/examples/ReasonerAgent-Web"

def run_reasoner_agent_stream(query: str, max_steps: int):
    """
    Ejecuta ReasonerAgent y acumula la salida línea a línea.
    Devuelve el log completo acumulado en cada actualización.
    """
    cmd = [
        "python", f"{REASONER_DIR}/main.py", "test_job",
        "--query", query,
        "--api_key", AZURE_API_KEY,
        "--model", "gpt-4o",
        "--max_steps", str(max_steps)
    ]

    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    accumulated = ""

    while True:
        line = process.stdout.readline()
        if not line and process.poll() is not None:
            break
        if line:
            accumulated += line
            yield accumulated  # Devolver todo lo acumulado hasta el momento

    process.wait()
    yield accumulated  # Asegurarse de devolver el log final

# Creamos la interfaz Gradio
interface = gr.Interface(
    fn=run_reasoner_agent_stream,
    inputs=[
        gr.Textbox(label="Consulta", value="Quién es el presidente de EEUU"),
        gr.Slider(minimum=1, maximum=100, step=1, value=15, label="Max Steps")
    ],
    outputs=gr.Textbox(label="Log Completo", lines=25),
    title="ReasonerAgent - Log Streaming Acumulado",
    description="Ingresa tu consulta y se mostrará en tiempo real el log completo acumulado."
)

interface.launch()
