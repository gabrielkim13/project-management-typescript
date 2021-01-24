export abstract class BaseProject<T extends HTMLElement = HTMLElement, U extends HTMLElement = HTMLDivElement> {
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
