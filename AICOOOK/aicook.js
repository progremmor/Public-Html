class AICookApp{
    constructor() {
        this.apiKey=localStorage.getItem('geminiApiKey')||'';
        this.initializeElements();
        this.bindEvents();
        this.loadAPIKey();
    }
    initializeElements(){
        this.apiKeyInput=document.getElementById('api-key');
        this.saveAPIKeyBtn=document.getElementById('save-api-key');
        this.saveIngredientInput=document.getElementById('ingredients')
        this.dieterySelect=document.getElementById('Diet')
        this.cuisineSelect=document.getElementById('Cuisine')
        this.generateBtn=document.getElementById('makeRecipe')
        this.recipeSectoin=document.getElementById('recipeSection')
        this.recipeContent=document.getElementById('recipeContent')
    }
    bindEvents(){
        this.saveAPIKeyBtn.addEventListener('click',()=>this.saveAPIKey())
        this.generateBtn.addEventListener('click',()=>generateRecipe());
        this.apiKeyInput.addEventListener('keypress',()=>{
            if(e.key==='Enter'){
                this.saveAPIKey();
            }
        })
        this.ingredientsInput.addEventListener('keypress',(e)=>{
            if(e.key==='Enter'&& e.ctrlKey){
                this.generateRecipe();
            }
        })
    }
    saveAPIKey(){
        const apiKey=this.apiKeyInput.ariaValueMax.trim();
        if(apiKey){
            localStorage.setItem('geminiApiKey',apiKey);
            this.apiKey=apiKey;
            this.updateApiKeyStatus(true);
            this.showSuccess('API Key saved successfully!');
        }else{
            this.showError('Please enter a valid API Key')
        }
    }
    loadAPIKey(){
        if(this.apiKey){
            this.apiKeyInput.value=this.apiKey;
            this.updateApiKeyStatus(true);
        }else{
            this.updateApiKeyStatus(false);
        }
    }
    updateApiKeyStatus(isValid){
        const btn=this.saveAPiKeyBtn;
        if(isValid){
            btn.textContent='Saved'
            btn.style.background='#28a745';
        }else{
            btn.textContent='Save'
            btn.style.background='#dc3545';
        }
    }
    async generateRecipe(){
        if(!this.apiKey){
            this.showError('Please enter a valid API Key.');
            return;
        }
        const ingredients=this.ingredientsInput.value.trim();
        if(!ingredients){
            this.showError('Please enter ingredients.');
            return;
        }
        this.showLoading(true);
        this.hideRecipe();
        try{
            const recipe=await this.callGeminiAPI(ingredients);
            this.displayRecipe(recipe);
        }catch(error){
            console.error("We are cooked",error);
            this.showError("An unexpected error has occurred");
        }finally{
            this.showLoading;
        }
    }
    async callGeminiAPI(ingredients){
        const dietary = this.dieterySelect.value;
        const cuisine = this.cuisineSelect.value;

        let prompt=`Create a detailed recipe using these ingredients: ${ingredients}.`
        if(dietary){
            prompt+= ` make sure my dietary preference is ${dietary}.`;
        }
        if(cuisine){
            prompt += ` Cuisine type should be: ${cuisine}.`
        }
        prompt+=`Please format your response as follows:
            -recipe name
            -prep time
            -cook time
            -servings
            -ingredients with quantities
            -instructions (numbered steps)
            -tips (optional)
            make sure the recipe is practical and delicicious!`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?${apiKey}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                contents: [{
                    parts:[{
                        text:prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens:2048,
                    topP: 0.95,
                    topK: 40
                }
            })
        })
        if(!response.ok){
            const errorData=await response.json();
            throw new Error(`HTTP error! status: ${errorData?.message||'Unknown error'}`)
        }
        const data=await response.json();
        return data.recipe;
    }
}