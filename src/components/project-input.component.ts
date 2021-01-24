namespace App {
    export class ProjectInput extends BaseProject<HTMLFormElement> {
        titleInputElement: HTMLInputElement;
        descriptionInputElement: HTMLTextAreaElement;
        peopleInputElement: HTMLInputElement;
    
        constructor() {
            super('project-input', 'afterbegin', 'user-input');
            
            this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
            this.descriptionInputElement = this.element.querySelector('#description') as HTMLTextAreaElement;
            this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    
            this.configure();
            this.renderContent();
        }
    
        private gatherUserInput(): [string, string, number] | void {
            const title = this.titleInputElement.value;
            const description = this.descriptionInputElement.value;
            const people = +this.peopleInputElement.value;
    
            const titleValidatable: Validatable = { value: title, required: true };
            const descriptionValidatable: Validatable = { value: description, required: true, minLength: 5 };
            const peopleValidatable: Validatable = { value: people, required: true, min: 1, max: 5 };
    
            if (
                !validate(titleValidatable) ||
                !validate(descriptionValidatable) ||
                !validate(peopleValidatable)
            ) {
                return alert('Invalid input! Please try again...');
            }
    
            return [title, description, people];
        }
    
        private clearInputs() {
            this.titleInputElement.value = '';
            this.descriptionInputElement.value = '';
            this.peopleInputElement.value = '';
        }
    
        @AutoBind
        private submitHandler(event: Event) {
            event.preventDefault();
    
            const userInput = this.gatherUserInput();
    
            if (Array.isArray(userInput)) {
                const [title, description, people] = userInput;
    
                projectState.addProject(title, description, people);
    
                this.clearInputs();
            }
        }
    
        protected configure() {
            this.element.addEventListener('submit', this.submitHandler);
        }
    
        protected renderContent() { }
    }
}
