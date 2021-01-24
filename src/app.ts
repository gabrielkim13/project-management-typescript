/// <reference path="interfaces/drag-drop.interface.ts" />
/// <reference path="models/project.model.ts" />
/// <reference path="state/project.state.ts" />
/// <reference path="utils/validation.util.ts" />
/// <reference path="decorators/autobind.decorator.ts" />
/// <reference path="components/base-project.component.ts" />
/// <reference path="components/project-input.component.ts" />
/// <reference path="components/project-item.component.ts" />
/// <reference path="components/project-list.component.ts" />

namespace App {
    new ProjectInput();

    new ProjectList(ProjectStatus.Active);
    new ProjectList(ProjectStatus.Finished);
}
