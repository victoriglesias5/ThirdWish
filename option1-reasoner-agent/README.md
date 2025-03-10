# Option 1: Reasoning Browsing Agent (AllHands.Dev)

## Overview

This implementation uses the **Reasoning Browsing Agent** developed by [Maitrix.org](https://github.com/maitrix-org/llm-reasoners/tree/main/examples/ReasonerAgent-Web).  
The ReasonerAgent is designed to autonomously interact with web applications using advanced reasoning capabilities powered by LLMs (Large Language Models). It simulates user behavior and performs complex browsing tasks through **multi-step reasoning**.

You can explore the live demo of the ReasonerAgent here:  
👉 [https://easyweb.maitrix.org/](https://easyweb.maitrix.org/)

⚠️ **IMPORTANT**  
This implementation is a practical adaptation of **one** of the many examples provided in the official `llm-reasoners` repository. For complete documentation, updates, and additional examples, refer to the official project:  
👉 [ReasonerAgent-Web Official Repo](https://github.com/maitrix-org/llm-reasoners/tree/main/examples/ReasonerAgent-Web)

---

## Setup Instructions

### 1. Clone and Install `llm-reasoners`

```bash
git clone https://github.com/maitrix-org/llm-reasoners.git
cd llm-reasoners
pip install -e .

### 2. Install Dependencies for ReasonerAgent

```bash
pip install -r requirements.txt

---

# Azure OpenAI Integration (Instead of OpenAI API)

By default, the official ReasonerAgent uses the **OpenAI API** directly.
For this project, we have modified the code to work with **Azure OpenAI**.

---

## Pasos para Modificar `main.py`

1. **Navega a la carpeta:**

   ```bash
   cd /content/llm-reasoners/examples/ReasonerAgent-Web/

2. **Abre el archivo 'main.py' y localiza el diccionario 'model_info'**.

3. **Reemplaza la configuración de 'gpt-4o' con la siguiente:**

    '''python
    'gpt-4o': (
        os.environ.get("AZURE_API_BASE", "https://thirdwishgroup-ai.openai.azure.com"),  # Azure base
        'azure'
    )

4. **Asegúrate de tener configuradas correctamente tus credenciales de Azure OpenAI.**  
Puedes consultar el archivo de credenciales de ejemplo aquí:  
👉 [credentials.txt](#)
