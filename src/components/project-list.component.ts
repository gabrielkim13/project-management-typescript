import { BaseProject } from "./base-project.component.js";
import { ProjectItem } from "./project-item.component.js";

import { AutoBind } from "../decorators/auto-bind.decorator.js";
import { DragTarget } from "../interfaces/drag-drop.interface.js";
import { Project, ProjectStatus } from "../models/project.model.js";
import { projectState } from "../state/project.state.js";

export class ProjectList extends BaseProject implements DragTarget {
    private listElement: HTMLUListElement;
    
    projects: Project[] = [];

    constructor(private readonly type: ProjectStatus) {
        super('project-list', 'beforeend', `${type}-projects`);
        
        this.configure();
        this.renderContent();

        this.listElement = this.element.querySelector('ul')!;
    }

    protected configure() {
        projectState.addListener((projects: Project[]) => {
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
