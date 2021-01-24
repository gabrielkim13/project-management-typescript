import { ProjectInput } from "./components/project-input.component.js";
import { ProjectList } from "./components/project-list.component.js";

import { ProjectStatus } from "./models/project.model.js";

new ProjectInput();

new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);
