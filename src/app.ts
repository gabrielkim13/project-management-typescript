import { ProjectInput } from "./components/project-input.component";
import { ProjectList } from "./components/project-list.component";

import { ProjectStatus } from "./models/project.model";

new ProjectInput();

new ProjectList(ProjectStatus.Active);
new ProjectList(ProjectStatus.Finished);
