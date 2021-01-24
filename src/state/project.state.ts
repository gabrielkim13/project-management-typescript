namespace App {
    type ListenerFunction<T> = (data: T[]) => void;
    
    export abstract class BaseState<T> {
        protected listeners: ListenerFunction<T>[] = [];
    
        addListener(listener: ListenerFunction<T>) {
            this.listeners.push(listener);
        }
    
        invokeListeners(data: T[]) {
            this.listeners.forEach(listener => listener(data));
        }
    }
    
    export class ProjectState extends BaseState<Project> {
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

    export const projectState = ProjectState.getInstance();
}
