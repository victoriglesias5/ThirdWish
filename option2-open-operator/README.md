# Open Operator

This repository is an adaptation of [Open Operator](https://github.com/browserbase/open-operator).

## 📄 Original Repository

Please follow the installation and setup instructions provided in the official repository:  
👉 [https://github.com/browserbase/open-operator](https://github.com/browserbase/open-operator)

---

## ⚙️ Changes in This Version

Since we are using **Azure OpenAI** credentials, we have made adjustments to ensure compatibility.  
This primarily affects the usage of the OpenAI SDK, as the original implementation does not support Azure out of the box.

Go to this path:
```bash
cd open-operator/api/agent
```


Inside this folder, you need to **replace** the original `route.ts` file with the version provided in this repository.

This modified `route.ts`:
- Uses the **Azure OpenAI** SDK.
- Adapts authentication and API calls to meet Azure’s requirements.

Additionally, we provide a correctly configured `.env.local` file to work with Azure OpenAI.

---

## ✅ Key Files in This Repository
- `.env.local`  
  Contains the environment variables configured for Azure OpenAI.
- `route.ts`  
  Contains the modified API logic to make requests to Azure OpenAI.  
  ⚠️ **Replace the original `route.ts` located at `open-operator\app\api\agent` with this one.**

---

## 🔧 Next Steps
1. Clone the official repository and follow its installation instructions:  
   [https://github.com/browserbase/open-operator](https://github.com/browserbase/open-operator)
2. Replace the following files with the versions from this repository:
   - `.env.local`
   - `route.ts` (located in `open-operator\app\api\agent`)
3. Fill in your Azure and Browserbase credentials in the `.env.local` file.

---



