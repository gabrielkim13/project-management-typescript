import { BaseProject } from "./base-project.component.js";

import { AutoBind } from "../decorators/auto-bind.decorator.js";
import { Draggable } from "../interfaces/drag-drop.interface.js";
import { Project } from "../models/project.model.js";

export class ProjectItem extends BaseProject<HTMLUListElement, HTMLLIElement> implements Draggable {
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
