class AICookApp{
    constructor() {
        this.apiKey=localStorage.getItem('geminiApiKey')||'';
        this.initializeElements();
        this.bindEvents();
        this.loadAPIKey();
    }
    initializeElements(){
        this.apiKeyInput=document.getElementById('api-key');
        this.loading=document.getElementById('loading');
        this.saveAPIKeyBtn=document.getElementById('save-api-key');
        this.ingredientInput=document.getElementById('ingredients')
        this.dieterySelect=document.getElementById('Diet')
        this.cuisineSelect=document.getElementById('Cuisine')
        this.generateBtn=document.getElementById('makeRecipe')
        this.recipeSection=document.getElementById('recipeSection')
        this.recipeContent=document.getElementById('recipeContent')
    }
    bindEvents(){
        this.saveAPIKeyBtn.addEventListener('click',()=>this.saveAPIKey())
        this.generateBtn.addEventListener('click',()=>this.generateRecipe());
        this.apiKeyInput.addEventListener('keypress',(e)=>{
            if(e.key==='Enter'){
                this.saveAPIKey();
            }
        })
        this.ingredientInput.addEventListener('keypress',(e)=>{
            if(e.key==='Enter'&& e.ctrlKey){
                this.generateRecipe();
            }
        })
    }
    saveAPIKey(){
        const apiKey=this.apiKeyInput.value.trim();
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
        const btn=this.saveAPIKeyBtn;
        if(isValid){
            btn.textContent='Saved'
            btn.style.background='#28a745';
        }else{
            btn.textContent='Save'
            btn.style.background='#dc3545';
        }
    }
    showSuccess(){
        alert("Recipe Bot Has Arrived")
    }
    showLoading(show){
        if(show){
            this.loading.classList.add('show')
            this.generateBtn.disabled=true;
            this.generateBtn.textContent='Generating Recipe...'
        }else{
            this.loading.classList.remove('show')
            this.generateBtn.disabled=false;
            this.generateBtn.textContent='Generate Recipe'
        }
    }
    hideRecipe(){

    }
    showError(){
        alert("Recipe lost in Transit")
    }
    async generateRecipe(){
        if(!this.apiKey){
            this.showError('Please enter a valid API Key.');
            return;
        }
        const ingredients=this.ingredientInput.value.trim();
        if(!ingredients){
            this.showError('Please enter ingredients.');
            return;
        }
        this.showLoading(true);
        this.hideRecipe();
        try{
            const recipe=await this.callGeminiAPI(ingredients);
            this.displayRecipe(recipe);
            this.showLoading(false);
        }catch(error){
            console.error("We are cooked",error);
            this.showError("An unexpected error has occurred");
        }finally{
            this.showLoading;
        }
    }
    displayRecipe(recipeText){
        const formattedRecipe=this.formatRecipe(recipeText);
        this.recipeContent.innerHTML=formattedRecipe;
        this.showRecipe();
    }
    showRecipe(){
        this.recipeSection.classList.add('show');
        this.recipeSection.scrollIntoView({behavior: 'smooth'});
    }
    formatRecipe(text){
        text=text.replace(/(^| ) +/gm,'$1');
        text=text.replace(/^- */gm,'');
        text=text.replace(/\*\*(.+?)\*\*/gm,'<strong>$1</strong>');
        text=text.replace(/^(.+)/g,'<h3 class="recipe-title">$1</h3>');
        text=text.replace(/^\*/gm,'•');
        text=text.replace(/^(.+)/gm,'<p>$1</p>');

        return text
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
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
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
        return data.candidates[0].content.parts[0].text.trim();
    }
}
document.addEventListener('DOMContentLoaded',()=>new AICookApp());