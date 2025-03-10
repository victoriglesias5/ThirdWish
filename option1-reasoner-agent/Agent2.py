import os
import subprocess
import gradio as gr
from openai import AzureOpenAI

# Configurar variables de entorno para Azure OpenAI
os.environ["AZURE_OPENAI_API_KEY"] = "e78c273f6f844dd2bb0f00fdba023b6a"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://thirdwishgroup-ai.openai.azure.com"
os.environ["AZURE_OPENAI_API_VERSION"] = "2024-08-01-preview"

# Inicializar el cliente de Azure OpenAI
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION")
)

# Ruta del repositorio de ReasonerAgent (ajusta según tu entorno)
REASONER_DIR = "/content/llm-reasoners/examples/ReasonerAgent-Web"

def summarize_log(log: str, query: str) -> str:
    """
    Extrae las últimas 10 líneas del log y, junto con la consulta inicial,
    envía un prompt a Azure OpenAI para obtener la respuesta a la consulta.
    """
    # Extraer las últimas 10 líneas (o todas si son menos)
    lines = log.strip().splitlines()
    last_lines = lines[-10:] if len(lines) >= 10 else lines
    excerpt = "\n".join(last_lines)
    
    prompt = (
        "A continuación se muestra la consulta inicial y las últimas 10 líneas del log de ejecución "
        "de un agente de navegador. Utilizando únicamente esta información, determina la respuesta a la consulta inicial.\n\n"
        f"Consulta inicial: {query}\n\n"
        f"Últimas 10 líneas del log:\n{excerpt}\n\n"
        "Respuesta:"
    )
    
    messages = [
        {"role": "system", "content": "Eres un experto en análisis de logs y en la búsqueda de respuestas a partir de ellos."},
        {"role": "user", "content": prompt}
    ]
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # Asegúrate de que este sea el modelo o despliegue correcto en tu recurso Azure
            messages=messages,
            temperature=0.3,
            max_tokens=150
        )
        summary = response.choices[0].message.content.strip()
    except Exception as e:
        summary = f"Error al resumir: {e}"
    return summary

def run_reasoner_agent_stream(query: str, max_steps: int):
    """
    Ejecuta ReasonerAgent y muestra el log en tiempo real sin resumirlo.
    Al finalizar, extrae las últimas 10 líneas del log y junto con la consulta inicial,
    obtiene de Azure OpenAI la respuesta final a la consulta.
    """
    cmd = [
        "python", f"{REASONER_DIR}/main.py", "test_job",
        "--query", query,
        "--api_key", os.getenv("AZURE_OPENAI_API_KEY"),
        "--model", "gpt-4o",
        "--max_steps", str(max_steps)
    ]
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    accumulated = ""
    
    # Mostrar el log en tiempo real sin procesar
    while True:
        line = process.stdout.readline()
        if not line and process.poll() is not None:
            break
        if line:
            accumulated += line
            yield accumulated  # Se muestra el log completo acumulado
    
    process.wait()
    # Una vez finalizado, se procesa únicamente el fragmento final del log para obtener la respuesta a la consulta
    final_summary = summarize_log(accumulated, query)
    yield final_summary

# Crear la interfaz Gradio
interface = gr.Interface(
    fn=run_reasoner_agent_stream,
    inputs=[
        gr.Textbox(label="Consulta", value="Quién es el presidente de EEUU"),
        gr.Slider(minimum=1, maximum=100, step=1, value=15, label="Max Steps")
    ],
    outputs=gr.Textbox(label="Log y Respuesta Procesados", lines=25),
    title="ReasonerAgent - Respuesta Final a partir del Log",
    description="Ingresa tu consulta. Se mostrará en tiempo real el log completo y, al finalizar, se extraerán las últimas 10 líneas para obtener la respuesta a la consulta inicial."
)

interface.launch()
