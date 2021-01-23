/** AutoBind Decorator */
const AutoBind: MethodDecorator = (_1, _2, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const newDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        }
    }
    
    return newDescriptor;
}

/** Validation */
interface Validatable {
    value: string | number;
    required: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(property: Validatable): boolean {
    let isValid = true;

    if (property.required) isValid &&= property.value.toString().trim().length > 0;

    switch (typeof property.value) {
        case 'number':
            if (property.min != null) isValid &&= property.value >= property.min;
            if (property.max != null) isValid &&= property.value <= property.max;
            
            break;
            
        case 'string':
            if (property.minLength != null) isValid &&= property.value.trim().length >= property.minLength;
            if (property.maxLength != null) isValid &&= property.value.trim().length <= property.maxLength;

            break;
            
        default:
    }

    return isValid;
}

/** Project State Class (Singleton) */
enum ProjectStatus { Active = 'active', Finished = 'finished' };

class Project {
    constructor (
        public id: number,
        public title: string,
        public description: string,
        public people: number,
        public status = ProjectStatus.Active) {}

    get peopleText() {
        const isPlural = this.people > 1;

        return `${this.people} ${isPlural ? 'people' : 'person'}`;
    }
}

type ListenerFunction<T> = (data: T[]) => void;

abstract class BaseState<T> {
    protected listeners: ListenerFunction<T>[] = [];

    addListener(listener: ListenerFunction<T>) {
        this.listeners.push(listener);
    }

    invokeListeners(data: T[]) {
        this.listeners.forEach(listener => listener(data));
    }
}

class ProjectState extends BaseState<Project> {
    private projects: Project[] = [];
    
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!this.instance) this.instance = new ProjectState();

        return this.instance
    }

    addProject(title: string, description: string, people: number) {
        const project = new Project(
            new Date().getTime(),
            title,
            description,
            people,
        );

        this.projects.push(project);
        this.invokeListeners(this.projects.slice());
    }
    
    moveProject(projectId: number, newStatus: ProjectStatus) {
        const projectIndex = this.projects.findIndex(project => project.id === projectId);
        
        if (projectIndex === -1 || this.projects[projectIndex].status === newStatus) return;
        
        this.projects[projectIndex].status = newStatus;
        this.invokeListeners(this.projects.slice());
    }
}

/** Base Project Class */
abstract class BaseProject<T extends HTMLElement = HTMLElement, U extends HTMLElement = HTMLDivElement> {
    templateElement: HTMLTemplateElement;
    hostElement: U;
    element: T;

    constructor(
        templateId: string, 
        insertPosition: InsertPosition, 
        newElementId?: string,
        hostElementId: string = 'app', 
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as U;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as T;
        if (newElementId) this.element.id = newElementId;

        this.attach(insertPosition);
    }

    private attach(insertPosition: InsertPosition) {
        this.hostElement.insertAdjacentElement(insertPosition, this.element);
    }

    protected abstract configure(): void;
    protected abstract renderContent(): void;
}

/** Drag and Drop */
interface Draggable {
    dragStartHandler: (event: DragEvent) => void;
    dragEndHandler: (event: DragEvent) => void;
}

interface DragTarget {
    dragOverHandler: (event: DragEvent) => void;
    dragDropHandler: (event: DragEvent) => void;
    dragLeaveHandler: (event: DragEvent) => void;
}

/** Project Item Class */
class ProjectItem extends BaseProject<HTMLUListElement, HTMLLIElement> implements Draggable {
    constructor(private readonly project: Project, hostId: string) {
        super('single-project', 'beforeend', project.id.toString(), hostId);
        
        this.configure();
        this.renderContent();
    }
    
    protected configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    
    protected renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = `${this.project.peopleText} assigned`;
        this.element.querySelector('p')!.textContent = this.project.description;
    }

    @AutoBind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.id.toString());
        event.dataTransfer!.effectAllowed = 'move';
    }
    
    @AutoBind
    dragEndHandler(_: DragEvent) { }
}

/** Project List Class */
class ProjectList extends BaseProject implements DragTarget {
    private listElement: HTMLUListElement;
    
    projects: Project[] = [];

    constructor(private readonly type: ProjectStatus) {
        super('project-list', 'beforeend', `${type}-projects`);
        
        this.configure();
        this.renderContent();

        this.listElement = this.element.querySelector('ul')!;
    }

    protected configure() {
        projectState.addListener(projects => {
            this.projects = projects.filter(project => project.status === this.type);
            this.renderProjects();
        })

        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dragDropHandler);
    }

    protected renderContent() {
        const listId = `${this.type}-projects-list`;

        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = `${this.type} Projects`.toUpperCase();
    }

    protected renderProjects() {
        this.listElement.innerHTML = '';

        this.projects.forEach(project => {
            new ProjectItem(project, this.listElement.id);
        })
    }

    @AutoBind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer?.types[0] === 'text/plain'){
            event.preventDefault();

            this.listElement.classList.add('droppable');
        }
    }
    
    @AutoBind
    dragLeaveHandler(_: DragEvent) {
        this.listElement.classList.remove('droppable');
    }
    
    @AutoBind
    dragDropHandler(event: DragEvent) { 
        const projectId = +event.dataTransfer!.getData('text/plain');

        projectState.moveProject(projectId, this.type);
    }
}

/** Project Input Class */
class ProjectInput extends BaseProject<HTMLFormElement> {
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

        console.log({title, description, people});
        
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

const projectState = ProjectState.getInstance();

const projectInput = new ProjectInput();

const activeProjectsList = new ProjectList(ProjectStatus.Active);
const finishedProjectsList = new ProjectList(ProjectStatus.Finished);
