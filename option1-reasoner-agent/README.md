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
```

### 2. Install Dependencies for ReasonerAgent

```bash
pip install -r requirements.txt
```
---

# Azure OpenAI Integration for ReasonerAgent-Web

This project modifies the official ReasonerAgent to utilize Azure OpenAI instead of the standard OpenAI API.

## Overview

By default, the ReasonerAgent from Maitrix.org uses the OpenAI API directly. This implementation adapts the code to work with Azure OpenAI, allowing users to leverage Azure's infrastructure and services.

## Modification Steps for `main.py`

1.  **Navigate to the Directory:**
    ```bash
    cd /content/llm-reasoners/examples/ReasonerAgent-Web/
    ```

2.  **Edit `main.py`:**
    * Open `main.py` and locate the `model_info` dictionary.
    * Replace or add the `gpt-4o` configuration with the following:

    ```python
    'gpt-4o': (
        os.environ.get("AZURE_API_BASE", "[https://your-azure-openai-resource.openai.azure.com](https://www.google.com/search?q=https://your-azure-openai-resource.openai.azure.com)"),  # Replace with your Azure base URL
        'azure'
    )
    ```

3.  **Configure Azure Credentials:**
    * Ensure your Azure OpenAI credentials are correctly set in your environment variables.
    * See `credentials.txt` for a sample credentials file.

    👉 [credentials.txt](credentials.txt)

---

## Quick Test Example

After configuring the settings, run a test query to verify the agent's functionality:

```bash
python main.py test_job --query "Who is the president of the USA?" --api_key "your-azure-api-key" --model "gpt-4o"
```
👉 [example.py](example.py)

---

## Gradio Visualization Interface

To simplify the interaction with the ReasonerAgent and visualize its reasoning process, we have implemented two Gradio-based interfaces.

1.  **`Agent1.py`**
    * Displays the full execution log of the agent in real-time.

2.  **`Agent2.py`**
    * Displays the real-time execution log.
    * Once the process ends, the entire log is summarized using Azure OpenAI, providing a simplified final response.

### Run the Gradio Interfaces

```bash
python Agent1.py
```

or

```bash
python Agent2.py
```

---

## Notes

This implementation demonstrates the ReasonerAgent applied specifically to the WIPO Madrid Fee Calculator use case.

For further information, advanced configurations, and additional use cases, refer to the official repository documentation:

👉 [ReasonerAgent-Web by Maitrix.org](https://github.com/maitrix-org/llm-reasoners/tree/main/examples/ReasonerAgent-Web)
